import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock4, Flame, BarChart2 } from "lucide-react";
import { useConsolidatedStats } from "@/queries/timerQueries";

// Variants for dropdown buttons
const dropdownButtonVariants = {
  initial: { backgroundColor: "transparent" },
  hover: { backgroundColor: "var(--bg-ter)" },
};

function StatsSummary() {
  const [selectedTime, setSelectedTime] = useState("Today");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Use the consolidated TanStack Query hook
  const { data, isLoading, error, refetch } = useConsolidatedStats();

  // Extract the user-specific stats from the consolidated data object
  const stats = data?.userStats;

  // Prepare study data from the query response
  const studyData = stats
    ? {
        Today: `${stats.timePeriods?.today || "0.0"} h`,
        "This week": `${stats.timePeriods?.thisWeek || "0.0"} h`,
        "This month": `${stats.timePeriods?.thisMonth || "0.0"} h`,
        "All time": `${stats.timePeriods?.allTime || "0.0"} h`,
      }
    : {
        Today: "0.0 h",
        "This week": "0.0 h",
        "This month": "0.0 h",
        "All time": "0.0 h",
      };

  // Prepare user stats from the query response
  const userStats = stats
    ? {
        rank: stats.rank || 0,
        totalUsers: stats.totalUsers || 0,
        streak: stats.streak || 0,
        level: stats.level || {
          name: "Beginner",
          progress: 0,
          hoursToNextLevel: "2.0",
        },
      }
    : {
        rank: 0,
        totalUsers: 0,
        streak: 0,
        level: {
          name: "Beginner",
          progress: 0,
          hoursToNextLevel: "2.0",
        },
      };

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle refresh - use refetch from TanStack Query
  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    // Loading skeleton UI remains the same
    return (
      <motion.div
        className="txt m-4 mt-2 w-[25%] h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="animate-pulse">
          <div className="h-5 w-5 rounded-full bg-gray-500/20 ml-auto -mb-1" />
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-gray-500/20" />
            <div className="h-6 w-24 rounded-md bg-gray-500/20" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-gray-500/20" />
            <div className="h-6 w-16 rounded-md bg-gray-500/20" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-12 w-12 rounded-full bg-gray-500/20" />
            <div className="h-6 w-24 rounded-md bg-gray-500/20" />
          </div>
          <div className="h-5 w-40 rounded-md bg-gray-500/20 mb-2" />
          <div className="relative w-full h-5 rounded-2xl overflow-hidden bg-gray-500/20">
            <div className="absolute left-0 top-0 h-5 rounded-2xl bg-white/60 dark:bg-gray-600/50" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    // Error UI remains the same
    return (
      <motion.div
        className="txt m-4 mt-2 w-[25%] h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <p className="text-red-400 text-sm">
            {error.message || "Failed to load statistics"}
          </p>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // Render content UI - no changes needed here
  return (
    <motion.div
      className="txt m-4 mt-2 w-[25%] h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between -mb-3">
        <div ref={dropdownRef} className="relative ml-auto">
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 txt-dim hover:txt"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span>{selectedTime}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </motion.button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute right-0 top-5 mt-2 w-32 bg-primary txt rounded-lg shadow-lg overflow-hidden z-10"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {Object.keys(studyData).map((time) => (
                  <motion.button
                    key={time}
                    className="block w-full text-left px-4 py-2 btn-rad"
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
      </div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Clock4 className="h-12 w-12 p-2.5 bg-green-400/70 rounded-full text-gray-100" />
        <p className="text-2xl txt-dim font-bold">{studyData[selectedTime]}</p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <BarChart2 className="h-12 w-12 p-2.5 bg-blue-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-blue-400">
          #{userStats.rank || 0}
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Flame className="h-12 w-12 p-2.5 bg-yellow-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-yellow-400">
          {userStats.streak || 0} days
        </p>
      </motion.div>

      <motion.p
        className="text-md txt-dim pl-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        {userStats.level.name} ({userStats.level.current || 1}-
        {userStats.level.current + 1 || 2}h)
      </motion.p>

      <div className="relative w-full bg-ter h-5 rounded-2xl mt-2">
        <motion.p
          className="absolute h-full w-full pr-5 txt-dim text-sm text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {userStats.level.hoursToNextLevel}h left
        </motion.p>
        <motion.div
          className="bg-purple-500 h-5 rounded-2xl"
          initial={{ width: 0 }}
          animate={{ width: `${userStats.level.progress || 0}%` }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

export default StatsSummary;
