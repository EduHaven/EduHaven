import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useConsolidatedStats } from "@/queries/timerQueries";

export const levels = [
  { name: "Bronze", min: 0, max: 10, color: "#cd7f32" },
  { name: "Silver", min: 10, max: 30, color: "#c0c0c0" },
  { name: "Gold", min: 30, max: 60, color: "#ffd700" },
  { name: "Platinum", min: 60, max: 100, color: "#1f75fe" },
  { name: "Diamond", min: 100, max: 150, color: "#00e5ff" },
  { name: "Emerald", min: 150, max: Infinity, color: "#50c878" },
];

const MonthlyLevel = () => {
  const { userId } = useParams();
  // Replace direct axios call with consolidated data hook
  const { data, isLoading, error } = useConsolidatedStats(userId);

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex flex-col gap-4 w-full">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold txt">Monthly Level</h3>
          <p className="flex gap-1 items-end txt-dim">
            Total:{" "}
            <span className="w-10 h-5 bg-ter rounded-lg animate-pulse inline-block mb-0.5"></span>
          </p>
        </div>
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-28 h-28 bg-ter rounded-full"></div>
          <div className="flex flex-col flex-1 gap-2">
            <p className="w-full h-10 bg-ter rounded-full"></p>
            <p className="w-2/3 h-5 bg-ter rounded-xl"></p>
          </div>
        </div>
        <div className="w-full">
          <div className="h-10 w-full rounded-full bg-ter animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex items-center justify-center w-full">
        <p className="text-red-400">No data available</p>
      </div>
    );
  }

  // Get monthly data from the consolidated response
  const totalHours = data.userStats?.timePeriods?.thisMonth
    ? parseFloat(data.userStats.timePeriods.thisMonth)
    : 0;

  const currentLevel =
    levels.find((lvl) => totalHours >= lvl.min && totalHours < lvl.max) ||
    levels[levels.length - 1];

  const nextLevel = levels[levels.indexOf(currentLevel) + 1];

  // Show progress as percentage of the next level's requirement so
  // 10.7 hours out of 30h (next level) => ~35.7% visible on the bar
  const progress = nextLevel
    ? Math.max(0, Math.min(100, (totalHours / nextLevel.min) * 100))
    : 100;

  const hoursNeeded = nextLevel ? nextLevel.min - totalHours : 0;

  return (
    <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 flex flex-col w-full">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold mb-4 txt">Monthly Level</h3>
        <p className="txt-dim">Total: {totalHours.toFixed(1)} h</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 flex items-center justify-center mb-4">
          <img
            src={`/EduhavenBadges/${currentLevel.name.toLowerCase()}Badge.svg`}
            alt={currentLevel.name}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p
            className="font-extralight text-5xl font-poppins"
            style={{ color: currentLevel.color }}
          >
            {currentLevel.name}
          </p>
          <p className="text-md mb-2 txt-dim">
            {nextLevel
              ? `${hoursNeeded.toFixed(1)} hrs to ${nextLevel.name}`
              : "Max level reached 🎉"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="h-10 bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              backgroundColor: currentLevel.color,
            }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyLevel;
