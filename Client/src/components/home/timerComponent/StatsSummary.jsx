import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Clock4, Flame, BarChart2 } from "lucide-react";
import { useConsolidatedStats } from "@/queries/timerQueries";
import { levels } from "@/components/stats/MonthlyLevel";
import { fetchConsolidatedStats } from "@/api/timerApi";
import { useTimerStore } from "@/stores/timerStore";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} 
from "@/components/ui/dropdown-menu";

const periodMapping = {
  Today: "daily",
  "This week": "weekly",
  "This month": "monthly",
  // "All time": "all-time"  ---> this option has been currently not been set up in the backend logic
};

// This allows to display the current monthly level as in the stats page
const getMonthlyLevel = (monthlyHours) => {
  const totalHours = parseFloat(monthlyHours) || 0;
  const currentLevel =
    levels.find((lvl) => totalHours >= lvl.min && totalHours < lvl.max) ||
    levels[levels.length - 1];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1];
  const range = nextLevel
    ? `${currentLevel.min}-${nextLevel.min}h`
    : `${currentLevel.min}h+`;

  return { name: currentLevel.name, range };
};

function StatsSummary() {
  const [selectedTime, setSelectedTime] = useState("Today");

  // Get current timer state from store
  const { time: currentTimerTime, isRunning, startTime } = useTimerStore();

  // Get the period for API call based on selected filter
  const apiPeriod = periodMapping[selectedTime] || "daily";

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["consolidatedStats", apiPeriod],
    queryFn: () => fetchConsolidatedStats(null, apiPeriod),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  // Get the current session hours

  const getCurrentSessionHours = () => {
    if (!isRunning || !startTime) return 0;

    const now = new Date();
    const start = new Date(startTime);
    const sessionSeconds = Math.floor((now - start) / 1000);
    // const totalCurrentSeconds = sessionSeconds + (currentTimerTime.hours * 3600 + currentTimerTime.minutes * 60 + currentTimerTime.seconds);

    // return totalCurrentSeconds / 3600;
    return sessionSeconds / 3600;
  };

  const stats = data?.userStats;

  const currentSessionHours = getCurrentSessionHours();

  // Debug: log raw and derived values to help trace any calculation issues
  /*
  useEffect(() => {
    if (stats) {
      console.log("[StatsSummary] raw stats:", stats);
      console.log("[StatsSummary] timePeriods:", stats.timePeriods);
      console.log("[StatsSummary] currentSessionHours:", currentSessionHours);
      console.log("[StatsSummary] studyData:", {
        Today: getEnhancedValue(stats.timePeriods?.today || "0.0", "Today"),
        ThisWeek: getEnhancedValue(stats.timePeriods?.thisWeek || "0.0", "This week"),
        ThisMonth: getEnhancedValue(stats.timePeriods?.thisMonth || "0.0", "This month"),
      });
      console.log("[StatsSummary] level object:", userStats.level);
    }
  }, [stats, currentSessionHours]);
*/
  const getEnhancedValue = (baseValue, timeFilter) => {
    const base = parseFloat(baseValue) || 0;

    if (timeFilter === "Today" && currentSessionHours > 0) {
      const today = new Date().toISOString().split("T")[0];
      const isToday =
        !startTime || new Date(startTime).toISOString().split("T")[0] === today;

      if (isToday) {
        return base + currentSessionHours;
      }
    }

    return base;
  };

  // Here the study data directly uses the values from the API call
  const studyData = stats
    ? {
        Today: `${getEnhancedValue(stats.timePeriods?.today || "0.0", "Today").toFixed(1)} h`,
        "This week": `${getEnhancedValue(stats.timePeriods?.thisWeek || "0.0", "This week").toFixed(1)} h`,
        "This month": `${getEnhancedValue(stats.timePeriods?.thisMonth || "0.0", "This month").toFixed(1)} h`,
        "All time": `${getEnhancedValue(stats.timePeriods?.allTime || "0.0", "All time").toFixed(1)} h`,
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

  // Handle refresh - use refetch from TanStack Query
  const handleRefresh = () => {
    refetch();
  };

  // Compute derived level display values locally (in case API returns only fractional parts)
  const computeLevelNumbers = () => {
    const lvl = userStats.level || {};
    // lvl.current is expected to be the base hours for current level (e.g., 6)
    const base = Number(lvl.current) || 0;
    const hoursInCurrent = Number(lvl.hoursInCurrentLevel) || 0;
    const totalHours = base + hoursInCurrent;

    // Find the next level from the levels array (use min value greater than base)
    const nextLevel = levels.find((l) => l.min > base) || null;
    const nextMin = nextLevel ? Number(nextLevel.min) : null;

    // Compute hours left to next level (absolute hours)
    const hoursToNextTotal =
      nextMin !== null ? Math.max(0, nextMin - totalHours) : 0;

    // Progress should be numeric
    const progress = Number(lvl.progress) || 0;

    return { totalHours, hoursToNextTotal, progress };
  };

  const {
    totalHours: computedTotalHours,
    hoursToNextTotal,
    progress: computedProgress,
  } = computeLevelNumbers();
  // Prefer to compute level based on monthly total (same source used earlier). If missing, fall back to computed total.
  const monthlyTotal =
    Number(getEnhancedValue(stats?.timePeriods?.thisMonth || "0.0", "Today")) ||
    computedTotalHours;
  const totalForLevel = monthlyTotal;

  // Compute hours left to next level based on totalForLevel and levels array
  const findNextLevelThreshold = () => {
    const baseLevel =
      levels.find(
        (lvl) => totalForLevel >= lvl.min && totalForLevel < lvl.max
      ) || levels[levels.length - 1];
    const next = levels[levels.indexOf(baseLevel) + 1];
    if (!next) return 0;
    return Math.max(0, next.min - totalForLevel);
  };

  const hoursLeftToNext = findNextLevelThreshold();

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
          <Button
            onClick={handleRefresh}
            variant="default"
            size="default"
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  // Render content UI
  return (
    <motion.div
      className="txt m-4 mt-2 w-[25%] h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between -mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              size="default"
              className="flex items-center space-x-1 txt-dim hover:txt ml-auto"
            >
              <span>{selectedTime}</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {Object.keys(studyData).map((time) => (
              <DropdownMenuItem
                key={time}
                onClick={() => setSelectedTime(time)}
                className="cursor-pointer"
              >
                {time}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
        {getMonthlyLevel(totalForLevel.toString()).name}(
        {getMonthlyLevel(totalForLevel.toString()).range})
      </motion.p>

      <div className="relative w-full bg-ter h-5 rounded-2xl mt-2">
        <motion.p
          className="absolute h-full w-full pr-5 txt-dim text-sm text-right z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {hoursLeftToNext.toFixed(1)}h left
        </motion.p>
        <motion.div
          className="bg-purple-500 h-5 rounded-2xl relative z-0"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, computedProgress)}%` }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

export default StatsSummary;