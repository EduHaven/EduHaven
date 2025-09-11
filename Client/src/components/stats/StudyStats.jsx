import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// ──────────────────────────────────────────────────────────────
// Helper functions for date formatting
// ──────────────────────────────────────────────────────────────

const formatLocalHour = (date) => {
  // Format as "YYYY-MM-DD-HH" using local date values.
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  return `${year}-${month}-${day}-${hour}`;
};

const formatLocalDate = (date) => {
  // Format as "YYYY-MM-DD"
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Compute ISO week string ("YYYY-WW") for a given date.
const getISOYearWeek = (date) => {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(0, 0, 0, 0);
  // Shift date to Thursday in current week: ISO weeks start on Monday.
  tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
  const year = tempDate.getFullYear();
  const week1 = new Date(year, 0, 4);
  const diff = tempDate - week1;
  const weekNumber =
    1 + Math.round((diff / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${year}-${weekNumber.toString().padStart(2, "0")}`;
};

// ──────────────────────────────────────────────────────────────
// Timeline Generators
// ──────────────────────────────────────────────────────────────

const generateHourlyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = hourDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    timeline.push({
      value: formatLocalHour(hourDate), // key: "YYYY-MM-DD-HH"
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateDailyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - i
    );
    const label = dayDate.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const value = formatLocalDate(dayDate); // key: "YYYY-MM-DD"
    timeline.push({
      value,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateWeeklyTimeline = () => {
  const timeline = [];
  const now = new Date();
  // Generate last 5 weeks (including the current week).
  for (let i = 4; i >= 0; i--) {
    const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const isoYearWeek = getISOYearWeek(weekDate); // e.g. "2025-06"
    // Label can show the week number.
    const label = `Week ${isoYearWeek.split("-")[1]}`;
    timeline.push({
      value: isoYearWeek,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

const generateMonthlyTimeline = () => {
  const timeline = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthDate.toLocaleDateString([], {
      month: "short",
      year: "numeric",
    });
    const value = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`; // key: "YYYY-MM"
    timeline.push({
      value,
      label,
      totalHours: 0,
      studyRoomHours: 0,
    });
  }
  return timeline;
};

// ──────────────────────────────────────────────────────────────
// Compute summary
// ──────────────────────────────────────────────────────────────

const computeSummary = (data) => {
  if (!data || data.length === 0) {
    return { totalStudyHours: 0, avgDaily: 0, maxStudyHours: 0 };
  }
  const totalStudyHours = data.reduce(
    (acc, item) => acc + (item.totalHours || 0),
    0
  );
  const avgDaily = totalStudyHours / data.length;
  const maxStudyHours = Math.max(...data.map((item) => item.totalHours || 0));
  return { totalStudyHours, avgDaily, maxStudyHours };
};

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────

const StudyStats = () => {
  const [view, setView] = useState("daily");
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [userStats, setUserStats] = useState({
    rank: 0,
    totalUsers: 0,
    streak: 0,
    maxStreak: 0,
  });
  const backendUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleGetStats = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch period-based stats
        const response = await fetch(
          `${backendUrl}/timerstats?period=${view}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        let timeline = [];

        if (view === "hourly") {
          timeline = generateHourlyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "daily") {
          timeline = generateDailyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "weekly") {
          timeline = generateWeeklyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        } else if (view === "monthly") {
          timeline = generateMonthlyTimeline();
          result.periodData.forEach((item) => {
            const found = timeline.find((entry) => entry.value === item._id);
            if (found) {
              found.totalHours = item.totalHours || 0;
              found.studyRoomHours = item.studyRoomHours || 0;
            }
          });
          setStats(
            timeline.map((entry) => ({
              name: entry.label,
              totalHours: entry.totalHours,
              studyRoomHours: entry.studyRoomHours,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const handleGetUserStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${backendUrl}/user-stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        
        setUserStats({
          rank: result.rank || 0,
          totalUsers: result.totalUsers || 0,
          streak: result.streak || 0,
          maxStreak: result.maxStreak || 0,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    handleGetStats();
    handleGetUserStats();
  }, [view]);

  const summary = computeSummary(stats);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  return (
    <div className="flex bg-[var(--bg-ter)] rounded-3xl text-center w-full overflow-hidden">
      {/* Chart showing Total Study Hours and Study-Room Hours */}
      <div className="flex-1 bg-[var(--bg-sec)] pr-4 rounded-3xl">
        {/* Header with computed summary study stats */}
        <div className="flex flex-col md:flex-row justify-between items-center m-6">
          <div className="font-semibold">
            Total Study Hours:{" "}
            <strong>{summary.totalStudyHours.toFixed(2)}</strong>
            <span className="mx-4"></span>
            Average: <strong>{Number(summary.avgDaily).toFixed(2)}</strong>
            <span className="mx-4"></span>
            Maximum: <strong>{summary.maxStudyHours.toFixed(2)}</strong>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="flex items-center gap-1 hover:bg-gray-700 mt-4 md:mt-0"
                onClick={() => setIsOpen(!isOpen)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            {isOpen && (
              <DropdownMenuContent align="end" classname="border-none">
                <DropdownMenuItem onClick={() => handleDropdownClick("hourly")}>
                  Hourly
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                  Daily
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                  Weekly
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDropdownClick("monthly")}
                >
                  Monthly
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={stats}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--btn)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--btn)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--txt-disabled)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="var(--txt-dim)" />
            <YAxis stroke="var(--txt-dim)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-primary)",
                border: "none",
                borderRadius: "0.8rem",
                color: "var(--txt)",
              }}
              itemStyle={{ color: "var(--txt)" }}
              labelStyle={{ color: "var(--btn)" }}
            />
            <Area
              type="monotone"
              dataKey="totalHours"
              stroke="var(--btn-hover)"
              strokeWidth={2}
              fill="url(#colorHours)"
              dot={{ r: 2, fill: "var(--btn-hover)" }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="studyRoomHours"
              stroke="var(--btn)"
              strokeWidth={2}
              fill="url(#colorHours)"
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm p-6 mt-auto text-left w-fit">
        Rank:
        <div className="text-4xl mb-8 font-bold text-blue-500">
          {userStats.rank > 0 ? `${userStats.rank}/${userStats.totalUsers}` : "Unranked"}
        </div>
        Current Streak:
        <div className="text-4xl mb-8 font-bold text-yellow-500">
          {userStats.streak} <span className="text-lg font-normal">days</span>
        </div>
        Max Streak:
        <div className="text-4xl mb-8 font-bold text-green-500">
          {userStats.maxStreak} <span className="text-lg font-normal">days</span>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;
