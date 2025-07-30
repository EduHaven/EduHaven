import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock4, Flame, BarChart2 } from "lucide-react";

// Variants for dropdown buttons (using custom variable for hover bg)
const dropdownButtonVariants = {
  initial: { backgroundColor: "transparent" },
  hover: { backgroundColor: "var(--bg-ter)" },
};

function StudyStats() {
  const [selectedTime, setSelectedTime] = useState("Today");
  const [isOpen, setIsOpen] = useState(false);
  const studyData = {
    Today: "0.5 h",
    "This week": "3.2 h",
    "This month": "10.4 h",
    "All time": "45.8 h",
  };

  return (
    <motion.div
      className="txt m-2 sm:m-3 md:m-4 lg:m-6 mt-2 w-full md:w-[25%] lg:w-[30%] xl:w-[25%] min-w-0 h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dropdown */}
      <div className="relative mb-3 sm:mb-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 txt-dim hover:txt ml-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-xs sm:text-sm md:text-base">{selectedTime}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute right-0 top-5 mt-2 w-28 sm:w-32 bg-primary txt rounded-lg shadow-lg overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {Object.keys(studyData).map((time) => (
                <motion.button
                  key={time}
                  className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 btn-rad text-xs sm:text-sm"
                  variants={dropdownButtonVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setSelectedTime(time);
                    setIsOpen(false);
                  }}
                >
                  {time}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Clock4 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1 sm:p-1.5 md:p-2 bg-green-400/70 rounded-full text-gray-100 shrink-0" />
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl txt-dim font-bold">
          {studyData[selectedTime]}
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1 sm:p-1.5 md:p-2 bg-blue-400/70 rounded-full text-gray-100 shrink-0" />
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-400">#36385</p>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Flame className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 p-1 sm:p-1.5 md:p-2 bg-yellow-400/70 rounded-full text-gray-100 shrink-0" />
        <p className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-yellow-400">20 days</p>
      </motion.div>

      <motion.p
        className="text-xs sm:text-sm md:text-base txt-dim pl-1 sm:pl-2 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        Beginner (1-2h)
      </motion.p>
      <div className="relative w-full bg-ter h-3 sm:h-4 md:h-5 rounded-2xl mt-2">
        <motion.p
          className="absolute h-full w-full pr-2 sm:pr-3 md:pr-5 txt-dim text-xs sm:text-sm text-right flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          1.8h left
        </motion.p>
        <motion.div
          className="bg-purple-500 h-3 sm:h-4 md:h-5 rounded-2xl"
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

export default StudyStats;
