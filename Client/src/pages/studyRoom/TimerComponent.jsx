import React, { useState, useEffect } from "react";
import { Clock12, Timer, PlayCircle, RotateCcw } from "lucide-react";
function TimerComponent() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds + 1;
          if (newSeconds === 60) {
            const newMinutes = prevTime.minutes + 1;
            if (newMinutes === 60) {
              const newHours = prevTime.hours + 1;
              return { hours: newHours, minutes: 0, seconds: 0 };
            }
            return { ...prevTime, minutes: newMinutes, seconds: 0 };
          }
          return { ...prevTime, seconds: newSeconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 }); // Reset timer to zero
  };

  return (
    <div className="bg-gray-800 p-10 rounded-xl flex flex-col items-center justify-center">
      <h1 className="text-lg flex items-center gap-2">
        <Timer />
        Timer
      </h1>
      <div className="text-center">
        <div className="text-6xl font-bold mb-4">
          <span>{String(time.hours).padStart(2, "0")}</span>
          <span className="text-gray-400">:</span>
          <span>{String(time.minutes).padStart(2, "0")}</span>
          <span className="text-gray-400">:</span>
          <span>{String(time.seconds).padStart(2, "0")}</span>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStartPause}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Clock12 className="w-5 h-5 animate-spin" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 " />
                Start
              </>
            )}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <>
              <RotateCcw className="w-5 h-5 " />
              Reset
            </>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerComponent;
