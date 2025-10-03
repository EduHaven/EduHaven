import mongoose from "mongoose";
import StudySession from "../Model/StudySession.js";
import User from "../Model/UserModel.js";
import calculateStats from "../utils/TimerStatsCalculator.js";
import { updateStreaks } from "../utils/streakUpdater.js";

// =====================
// Utility Functions
// =====================
const sendError = (res, status, message, details = null) => {
  const errorResponse = { error: message };
  if (details) errorResponse.details = details;
  return res.status(status).json(errorResponse);
};

const validPeriods = ["hourly", "daily", "weekly", "monthly"];

const aggregateStudyHours = (userId, startDate) => {
  return StudySession.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        startTime: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalHours: { $sum: { $divide: ["$duration", 60] } },
      },
    },
  ]);
};

// =====================
// Controllers
// =====================

const createStudySession = async (req, res) => {
  try {
    const { startTime, endTime, duration } = req.body;

    if (!startTime || !endTime || !duration) {
      return sendError(
        res,
        400,
        "Start time, end time, and duration are required."
      );
    }

    if (duration > 10) await updateStreaks(req.user.id);

    const session = new StudySession({
      user: req.user.id,
      startTime,
      endTime,
      duration,
    });

    await session.save();
    await updateStreaks(req.user.id);
    res.status(201).json(session);
  } catch (error) {
    console.error("Study session save error:", error);
    return sendError(res, 500, "Failed to save study session", error.message);
  }
};

const getStudySessionStats = async (req, res) => {
  try {
    const { period } = req.query;
    if (!validPeriods.includes(period)) {
      return sendError(res, 400, "Invalid period");
    }

    const stats = await calculateStats(req.user.id, period);
    res.json(stats);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return sendError(
      res,
      500,
      "Failed to fetch study session stats",
      error.message
    );
  }
};

// Helper: Get stats for a user
const getUserStats = async (userId) => {
  const user = await User.findById(userId).select("streaks");
  const now = new Date();

  // Period start dates
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const weekStart = new Date(now);
  weekStart.setDate(
    now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
  );
  weekStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const allTimeStart = new Date(0);

  // Aggregations
  const [todayStats, weekStats, monthStats, allTimeStats] = await Promise.all([
    aggregateStudyHours(userId, todayStart),
    aggregateStudyHours(userId, weekStart),
    aggregateStudyHours(userId, monthStart),
    aggregateStudyHours(userId, allTimeStart),
  ]);

  // User rank
  const userRank = await StudySession.aggregate([
    {
      $group: {
        _id: "$user",
        totalHours: { $sum: { $divide: ["$duration", 60] } },
      },
    },
    { $sort: { totalHours: -1 } },
  ]);
  const currentUserRank =
    userRank.findIndex((i) => i._id.toString() === userId) + 1;

  // Level calculation (2 hrs per level)
  const totalHours = allTimeStats[0]?.totalHours || 0;
  const currentLevel = Math.floor(totalHours / 2) + 1;
  const hoursInCurrentLevel = totalHours % 2;
  const hoursToNextLevel = 2 - hoursInCurrentLevel;

  const levelName =
    totalHours >= 100
      ? "Master"
      : totalHours >= 50
        ? "Expert"
        : totalHours >= 25
          ? "Advanced"
          : totalHours >= 10
            ? "Intermediate"
            : "Beginner";

  return {
    timePeriods: {
      today: (todayStats[0]?.totalHours || 0).toFixed(1),
      thisWeek: (weekStats[0]?.totalHours || 0).toFixed(1),
      thisMonth: (monthStats[0]?.totalHours || 0).toFixed(1),
      allTime: (allTimeStats[0]?.totalHours || 0).toFixed(1),
    },
    rank: currentUserRank,
    totalUsers: userRank.length,
    streak: user?.streaks?.current || 0,
    maxStreak: user?.streaks?.max || 0,
    level: {
      name: levelName,
      current: currentLevel,
      hoursInCurrentLevel: hoursInCurrentLevel.toFixed(1),
      hoursToNextLevel: hoursToNextLevel.toFixed(1),
      progress: ((hoursInCurrentLevel / 2) * 100).toFixed(1),
    },
  };
};

// Helper: Leaderboard dataa
const getLeaderboardData = async (period, friendsOnly, userId) => {
  if (!validPeriods.includes(period)) throw new Error("Invalid period");

  const now = new Date();
  let startDate = new Date(0);
  if (period === "daily") startDate = new Date(now.setHours(0, 0, 0, 0));
  else if (period === "weekly") {
    const day = now.getDay();
    startDate = new Date(
      now.setDate(now.getDate() - day + (day === 0 ? -6 : 1))
    );
    startDate.setHours(0, 0, 0, 0);
  } else if (period === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // 🔑 Fix: Safe handling of friendsOnly
  let userIdsToInclude = [userId];
  if (friendsOnly) {
    const user = await User.findById(userId).select("friends");
    if (user && Array.isArray(user.friends)) {
      userIdsToInclude = [...userIdsToInclude, ...user.friends];
    }
  }

  const matchStage = { startTime: { $gte: startDate } };
  if (friendsOnly && userIdsToInclude.length > 0) {
    matchStage.user = {
      $in: userIdsToInclude.map((id) =>
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
      ),
    };
  }

  return StudySession.aggregate([
    { $match: matchStage },
    { $group: { _id: "$user", totalDuration: { $sum: "$duration" } } },
    { $sort: { totalDuration: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$user._id",
        username: "$user.FirstName",
        profilePicture: "$user.ProfilePicture",
        totalDuration: 1,
      },
    },
  ]);
};

// Controller: User study stats
const getUserStudyStats = async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return sendError(res, 500, "Failed to fetch user stats", error.message);
  }
};

// Controller: Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { period, friendsOnly } = req.query;
    const leaderboard = await getLeaderboardData(
      period,
      friendsOnly === "true",
      req.user?.id
    );
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return sendError(res, 500, "Failed to fetch leaderboard", error.message);
  }
};

// Controller: Consolidated stats
const getConsolidatedStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { period = "weekly", friendsOnly = "false" } = req.query;

    const [userStats, periodStats, leaderboard] = await Promise.all([
      getUserStats(userId),
      calculateStats(userId, period),
      getLeaderboardData(period, friendsOnly === "true", userId),
    ]);

    res.json({ userStats, periodStats, leaderboard });
  } catch (error) {
    console.error("Consolidated stats error:", error);
    return sendError(
      res,
      500,
      "Failed to fetch consolidated stats",
      error.message
    );
  }
};

// =====================
// Exports
// =====================
export {
  createStudySession,
  getStudySessionStats,
  getUserStudyStats,
  getLeaderboard,
  getConsolidatedStats,
  // Helpers
  getUserStats,
  getLeaderboardData,
};
