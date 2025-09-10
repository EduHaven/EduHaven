import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Clock12, PlayCircle, RotateCcw } from "lucide-react";
import AnimatedDigits from "./AnimatedDigits";
import axiosInstance from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/stores/timerStore";
import { usePostStudySession } from "@/queries/timerQueries";

function StudyTimer() {
  // Get state and actions from the global store
  const {
    time,
    isRunning,
    startTime,
    lastUpdate,
    hasPosted,
    lastSavedSeconds,
    setTime,
    setIsRunning,
    setStartTime,
    setLastUpdate,
    setHasPosted,
    setLastSavedSeconds,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimerStore();

  // Use TanStack Query mutation
  const { mutate: postSession, isLoading: isPosting } = usePostStudySession();

  // Refs for event handlers (needed for cleanup functions)
  const isRunningRef = useRef(isRunning);
  const timeRef = useRef(time);
  const startTimeRef = useRef(startTime);
  const hasPostedRef = useRef(hasPosted);

  // Update refs when state changes
  useEffect(() => {
    isRunningRef.current = isRunning;
    timeRef.current = time;
    startTimeRef.current = startTime;
    hasPostedRef.current = hasPosted;
  }, [isRunning, time, startTime, hasPosted]);

  // Utility: Calculate total time in seconds
  const getTotalSeconds = (t) => t.hours * 3600 + t.minutes * 60 + t.seconds;

  // Timer logic - moved to an effect that works with the store
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        let s = prev.seconds + 1;
        let m = prev.minutes;
        let h = prev.hours;

        if (s === 60) {
          s = 0;
          m += 1;
        }
        if (m === 60) {
          m = 0;
          h += 1;
        }

        return { hours: h, minutes: m, seconds: s };
      });
      setLastUpdate(new Date().toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, setTime, setLastUpdate]);

  // Handle posting session
  const handlePostSession = useCallback(
    (endTime) => {
      const totalMinutes = getTotalSeconds(time) / 60;
      if (totalMinutes < 1 || !startTime) return false;

      postSession(
        {
          startTime,
          endTime,
          duration: Math.round(totalMinutes),
        },
        {
          onSuccess: () => {
            setHasPosted(true);
            setLastSavedSeconds(getTotalSeconds(time));
            return true;
          },
          onError: (err) => {
            console.error("Failed to save session:", err);
            return false;
          },
        }
      );
    },
    [startTime, time, postSession, setHasPosted, setLastSavedSeconds]
  );

  // Auto post session
  useEffect(() => {
    if (!isRunning || hasPosted || !startTime) return;

    const interval = setInterval(() => {
      const totalSeconds = getTotalSeconds(time);
      const totalMinutes = totalSeconds / 60;

      if (totalMinutes >= 1 && totalSeconds - lastSavedSeconds >= 30) {
        handlePostSession(new Date().toISOString());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    startTime,
    time,
    hasPosted,
    lastSavedSeconds,
    handlePostSession,
  ]);

  // Save unsaved progress function
  const saveUnsavedProgress = useCallback(() => {
    if (!startTimeRef.current || hasPostedRef.current) return;

    const currentTime = timeRef.current;
    const totalSeconds = getTotalSeconds(currentTime);

    if (totalSeconds >= 60) {
      postSession({
        startTime: startTimeRef.current,
        endTime: new Date().toISOString(),
        duration: Math.round(totalSeconds / 60),
      });
    }
  }, [postSession]);

  // Save on exit or tab hidden
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const totalSeconds = getTotalSeconds(timeRef.current);

      if (isRunningRef.current && totalSeconds >= 60 && !hasPostedRef.current) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved study progress. Are you sure you want to leave?";
        saveUnsavedProgress();
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isRunningRef.current) {
        saveUnsavedProgress();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [saveUnsavedProgress]);

  // Start / Pause toggle
  const handleStartPause = () => {
    if (!isRunning) {
      // Starting a new timer or resuming a paused one
      if (!startTime) {
        // New timer session
        setStartTime(new Date().toISOString());
        setHasPosted(false);
        setLastSavedSeconds(0);
      }
      // Use the store's startTimer action instead of just setIsRunning
      startTimer();
    } else {
      // Pause an active timer
      pauseTimer();
    }
  };

  // Reset timer with confirmation
  const handleReset = async () => {
    const totalSeconds = getTotalSeconds(time);

    if (totalSeconds >= 60 && !hasPosted) {
      const confirmReset = window.confirm(
        "You have unsaved progress. Do you want to save this session before resetting?"
      );

      if (confirmReset) {
        handlePostSession(new Date().toISOString());
      }
    }

    resetTimer();
  };

  // Render component (UI remains largely the same)
  return (
    <div className="text-center flex flex-col items-center justify-center h-full">
      <div className="text-6xl font-bold mb-4">
        <div className="flex items-center gap-1">
          <AnimatedDigits value={String(time.hours).padStart(2, "0")} />
          <p className="text-gray-400 pb-3">:</p>
          <AnimatedDigits value={String(time.minutes).padStart(2, "0")} />
          <p className="text-gray-400 pb-3">:</p>
          <AnimatedDigits value={String(time.seconds).padStart(2, "0")} />
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <Button
          onClick={handleStartPause}
          className={`relative ${
            isRunning
              ? "bg-black/20 hover:bg-black/30"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          disabled={isPosting}
        >
          <span
            className={`flex items-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-0" : "opacity-100"
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span>Start Studying</span>
          </span>
          <span
            className={`absolute flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-100" : "opacity-0"
            }`}
          >
            <Clock12 className="w-5 h-5 animate-spin" />
            <span>Pause</span>
          </span>
        </Button>

        {/* Reset button */}
        <Button
          onClick={handleReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2"
          disabled={isPosting}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

export default StudyTimer;
