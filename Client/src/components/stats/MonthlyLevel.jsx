import axiosInstance from "@/utils/axios";
import React, { useEffect, useState } from "react";

const MonthlyLevel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const levels = [
    { name: "Bronze", min: 0, max: 10, color: "#cd7f32" },
    { name: "Silver", min: 10, max: 30, color: "#c0c0c0" },
    { name: "Gold", min: 30, max: 60, color: "#ffd700" },
    { name: "Platinum", min: 60, max: 100, color: "#1f75fe" },
    { name: "Diamond", min: 100, max: 150, color: "#00e5ff" },
    { name: "Emerald", min: 150, max: Infinity, color: "#50c878" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(
          "/study-sessions/stats?period=monthly"
        );
        setStats(res.data.periodData?.[0] || null);
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex items-center justify-center w-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex items-center justify-center w-full">
        <p className="text-red-400">No data available</p>
      </div>
    );
  }

  const totalHours = stats.totalHours || 0;

  const currentLevel =
    levels.find((lvl) => totalHours >= lvl.min && totalHours < lvl.max) ||
    levels[levels.length - 1];

  const nextLevel = levels[levels.indexOf(currentLevel) + 1];

  const progress = nextLevel
    ? ((totalHours - currentLevel.min) / (nextLevel.min - currentLevel.min)) *
      100
    : 100;

  const hoursNeeded = nextLevel ? nextLevel.min - totalHours : 0;

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex flex-col items-center w-full">
      {/* Title */}
      <h3 className="text-xl font-bold mb-4 text-cyan-300">Monthly Level</h3>

      {/* Badge with Profile Pic inside */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-4">
        <img
          src={`/EduhavenBadges/${currentLevel.name.toLowerCase()}Badge.svg`}
          alt={currentLevel.name}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* Level Name */}
      <p
        className="font-bold text-lg mb-4"
        style={{ color: currentLevel.color }}
      >
        {currentLevel.name}
      </p>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: currentLevel.color,
            }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-center text-gray-300">
          {nextLevel
            ? `${hoursNeeded.toFixed(1)} hrs to ${nextLevel.name}`
            : "Max level reached 🎉"}
        </p>
      </div>

      {/* Hours Only */}
      <div className="mt-4 w-full grid grid-cols-1 gap-2">
        <div className="bg-[var(--bg-ter)] rounded-md p-2 text-center">
          <p className="text-sm text-gray-400">Total Hours</p>
          <p className="font-semibold text-white">{totalHours.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLevel;
