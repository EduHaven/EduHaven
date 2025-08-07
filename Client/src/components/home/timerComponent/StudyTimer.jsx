import { useState, useEffect, useCallback, useRef } from "react";
import { Clock12, PlayCircle, RotateCcw } from "lucide-react";
import AnimatedDigits from "./AnimatedDigits";

const backendUrl = import.meta.env.VITE_API_URL;

function StudyTimer() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());
  const [hasPosted, setHasPosted] = useState(false);
  const [lastSavedSeconds, setLastSavedSeconds] = useState(0);

  // Refs to access current state in event handlers
  const isRunningRef = useRef(false);
  const timeRef = useRef({ hours: 0, minutes: 0, seconds: 0 });
  const startTimeRef = useRef("");
  const hasPostedRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    isRunningRef.current = isRunning;
    timeRef.current = time;
    startTimeRef.current = startTime;
    hasPostedRef.current = hasPosted;
  }, [isRunning, time, startTime, hasPosted]);

  // Utility: Calculate total time in seconds
  const getTotalSeconds = (t) =>
    t.hours * 3600 + t.minutes * 60 + t.seconds;

  // Restore session and catch up
  useEffect(() => {
    const saved = localStorage.getItem("studyTimer");
    if (!saved) return;

    const { time: savedTime, isRunning, startTime, lastUpdate, lastSavedSeconds } = JSON.parse(saved);
    let total = savedTime ? getTotalSeconds(savedTime) : 0;

    if (isRunning && lastUpdate) {
      const now = Date.now();
      const last = new Date(lastUpdate).getTime();
      const diff = Math.floor((now - last) / 1000);
      total += diff;
    }

    setTime({
      hours: Math.floor(total / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    });

    if (isRunning) setIsRunning(true);
    if (startTime) setStartTime(startTime);
    if (lastUpdate) setLastUpdate(lastUpdate);
    if (lastSavedSeconds) setLastSavedSeconds(lastSavedSeconds);
  }, []);

  // Save session to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(
        "studyTimer",
        JSON.stringify({ time, isRunning, startTime, lastUpdate, lastSavedSeconds })
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [time, isRunning, startTime, lastUpdate, lastSavedSeconds]);

  // Timer logic
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
  }, [isRunning]);

  // Periodic lastUpdate refresher
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date().toISOString());
    }, 10000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Post to backend with better error handling
  const handlePostSession = useCallback(async (endTime) => {
    const totalMinutes = getTotalSeconds(time) / 60;
    if (totalMinutes < 1) return false;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/timer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startTime,
          endTime,
          duration: Math.round(totalMinutes),
        }),
      });

      const result = await res.json();
      setHasPosted(true);
      setLastSavedSeconds(getTotalSeconds(time));
      return true;
    } catch (err) {
      console.error("Failed to save session:", err);
      return false;
    }
  }, [startTime, time]);

  // Auto post session every 30 seconds after 1 min
  useEffect(() => {
    if (!isRunning || hasPosted || !startTime) return;

    const interval = setInterval(async () => {
      const totalSeconds = getTotalSeconds(time);
      const totalMinutes = totalSeconds / 60;
      
      // Save every 30 seconds if there's at least 30 seconds of new progress
      if (totalMinutes >= 1 && (totalSeconds - lastSavedSeconds) >= 30) {
        const success = await handlePostSession(new Date().toISOString());
        if (success) {
          console.log("🔄 Auto-saved to database at", new Date().toLocaleTimeString());
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, time, hasPosted, lastSavedSeconds, handlePostSession]);

  // Save unsaved progress function
  const saveUnsavedProgress = useCallback(async () => {
    if (!startTimeRef.current || hasPostedRef.current) return;
    
    const currentTime = timeRef.current;
    const totalSeconds = getTotalSeconds(currentTime);
    
    if (totalSeconds >= 60) { // At least 1 minute
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${backendUrl}/timer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startTime: startTimeRef.current,
            endTime: new Date().toISOString(),
            duration: Math.round(totalSeconds / 60),
          }),
        });

        if (res.ok) {
          console.log("Saved progress before leaving");
          localStorage.removeItem("studyTimer");
        }
      } catch (err) {
        console.error("Failed to save on exit:", err);
      }
    }
  }, []);

  // Save on exit or tab hidden
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const currentTime = timeRef.current;
      const totalSeconds = getTotalSeconds(currentTime);
      
      if (isRunningRef.current && totalSeconds >= 60 && !hasPostedRef.current) {
        e.preventDefault();
        e.returnValue = "You have unsaved study progress. Are you sure you want to leave?";
        
        // Attempt to save in background
        saveUnsavedProgress();
        return e.returnValue;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isRunningRef.current) {
        saveUnsavedProgress();
      }
    };

    // Handle SPA navigation
    const handlePopState = () => {
      if (isRunningRef.current && getTotalSeconds(timeRef.current) >= 60 && !hasPostedRef.current) {
        const confirmLeave = window.confirm(
          "You have unsaved study progress. Do you want to save it before leaving?"
        );
        if (confirmLeave) {
          saveUnsavedProgress();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [saveUnsavedProgress]);

  // Start / Pause toggle
  const handleStartPause = () => {
    if (!isRunning && !startTime) {
      setStartTime(new Date().toISOString());
      setHasPosted(false);
      setLastSavedSeconds(0);
    }
    setIsRunning((prev) => !prev);
  };

  // Reset timer with confirmation
  const handleReset = async () => {
    const totalSeconds = getTotalSeconds(time);
    
    if (totalSeconds >= 60 && !hasPosted) {
      const confirmReset = window.confirm(
        "You have unsaved progress. Do you want to save this session before resetting?"
      );
      
      if (confirmReset) {
        await handlePostSession(new Date().toISOString());
      }
    }

    setTime({ hours: 0, minutes: 0, seconds: 0 });
    setIsRunning(false);
    setStartTime("");
    setLastUpdate(new Date().toISOString());
    setHasPosted(false);
    setLastSavedSeconds(0);
    localStorage.removeItem("studyTimer");
  };

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
        <button
          onClick={handleStartPause}
          className={`relative px-6 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ease-in-out hover:scale-105 active:scale-95 ${
            isRunning
              ? "bg-black/20 hover:bg-black/30"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
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
            className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isRunning ? "opacity-100" : "opacity-0"
            }`}
          >
            <Clock12 className="w-5 h-5 animate-spin" />
            <span>Pause</span>
          </span>
        </button>

        <button
          onClick={handleReset}
          className="hover:bg-red-700 p-2 rounded-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default StudyTimer;