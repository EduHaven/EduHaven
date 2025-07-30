import { useState } from "react";
import { motion } from "framer-motion";
import StudyTimer from "./StudyTimer";
import BreakTimer from "./BreakTimer";

function TimerComponent() {
  const [isBreakMode, setIsBreakMode] = useState(false);

  return (
    <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 rounded-2xl sm:rounded-3xl flex-1 text-white min-w-0 overflow-hidden">
      {/* Background Layers Crossfading */}
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-700/60 to-indigo-800"
        initial={{ opacity: isBreakMode ? 0 : 1 }}
        animate={{ opacity: isBreakMode ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-700/60 to-sky-800"
        initial={{ opacity: isBreakMode ? 1 : 0 }}
        animate={{ opacity: isBreakMode ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <nav className="flex mb-3 sm:mb-4 md:mb-6 absolute items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          <div className="relative">
            <button
              onClick={() => setIsBreakMode(false)}
              className={`text-sm sm:text-lg md:text-xl transition-colors duration-300 pb-1 ${!isBreakMode ? "font-semibold text-white" : "text-gray-300"
                }`}
            >
              Focus
            </button>
            {!isBreakMode && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 bottom-0 h-0.5 sm:h-1 bg-white rounded"
              />
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsBreakMode(true)}
              className={`text-sm sm:text-lg md:text-xl transition-colors duration-300 pb-1 ${isBreakMode ? "font-semibold text-white" : "text-gray-300"
                }`}
            >
              <span className="hidden sm:inline">Take a Break</span>
              <span className="sm:hidden">Break</span>
            </button>
            {isBreakMode && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 bottom-0 h-0.5 sm:h-1 bg-white rounded"
              />
            )}
          </div>
        </nav>
        {/* Timer Content with a subtle fade-in */}
        <div className="pt-6 sm:pt-8 md:pt-10 lg:pt-12">
          <motion.div
            key={isBreakMode ? "break" : "focus"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isBreakMode ? <BreakTimer /> : <StudyTimer />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TimerComponent;
