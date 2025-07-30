// No connection to backend, runs entirely on the frontend

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock12, Coffee, RotateCcw, Edit3, Check } from "lucide-react";
import AnimatedDigits from "./AnimatedDigits";

function BreakTimer() {
  const [breakTime, setBreakTime] = useState(600); // Default break time in seconds (10 min)
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customBreakTime, setCustomBreakTime] = useState(10);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setBreakTime((prev) => {
          if (prev <= 0) {
            alert("Break is over! Get back to studying.");
            setIsRunning(false);
            return customBreakTime * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, customBreakTime]);

  const handleStartPause = () => setIsRunning((prev) => !prev);
  const handleReset = () => {
    setIsRunning(false);
    setBreakTime(customBreakTime * 60);
  };
  const handleEditClick = () => setIsEditing(true);
  const handleApplyBreakTime = () => {
    setBreakTime(customBreakTime * 60);
    setIsEditing(false);
  };

  return (
    <div className="text-center flex flex-col items-center justify-center h-full px-2 sm:px-4 md:px-6">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
        {!isEditing ? (
          <>
            <AnimatedDigits
              value={String(Math.floor(breakTime / 60)).padStart(2, "0")}
            />
            <div className="text-gray-400 pb-1 sm:pb-2 md:pb-3">:</div>
            <AnimatedDigits value={String(breakTime % 60).padStart(2, "0")} />
          </>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <input
              type="number"
              min="1"
              value={customBreakTime}
              onChange={(e) => setCustomBreakTime(Number(e.target.value))}
              className="px-2 py-1 text-white rounded-md w-16 sm:w-20 md:w-32 lg:w-44 bg-transparent border-none outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            />
            <motion.button
              onClick={handleApplyBreakTime}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-green-600 p-1.5 sm:p-2 rounded-lg"
            >
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </div>
        )}
        {!isEditing && (
          <motion.button
            onClick={handleEditClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-2 sm:ml-3 md:ml-4 text-gray-300 hover:text-white"
          >
            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        )}
      </div>

      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 justify-center mt-2 sm:mt-3 md:mt-4 w-full max-w-xs sm:max-w-sm">
        <motion.button
          onClick={handleStartPause}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-300 ease-in-out flex-1 ${isRunning
              ? "bg-black/20 hover:bg-black/30"
              : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          <span
            className={`flex items-center gap-1.5 sm:gap-2 transition-opacity duration-300 ${isRunning ? "opacity-0" : "opacity-100"
              }`}
          >
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm md:text-base">
              <span className="hidden sm:inline">Start Break</span>
              <span className="sm:hidden">Start</span>
            </span>
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 transition-opacity duration-300 ${isRunning ? "opacity-100" : "opacity-0"
              }`}
          >
            <Clock12 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span className="text-xs sm:text-sm md:text-base">Pause</span>
          </span>
        </motion.button>
        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="hover:bg-red-700 p-2 sm:p-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 xs:w-auto min-w-[60px] sm:min-w-[80px]"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="xs:hidden sm:inline text-xs sm:text-sm md:text-base">Reset</span>
        </motion.button>
      </div>
    </div>
  );
}

export default BreakTimer;
