import express from "express";
import auth from "../Middlewares/authMiddleware.js";
import StudySession from "../Model/StudySession.js";
import User from "../Model/UserModel.js";
import calculateStats from "../utils/TimerStatsCalculator.js";
const router = express.Router();
import { updateStreaks } from "../utils/streakUpdater.js";

// Record new session
router.post("/timer", auth, async (req, res) => {
  try {
    const { startTime, endTime, duration } = req.body;
    if (duration > 10) updateStreaks(req.user.id);
    const session = new StudySession({
      user: req.user.id,
      startTime,
      endTime,
      duration,
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get("/timerstats", auth, async (req, res) => {
  try {
    const { period } = req.query;
    const validPeriods = ["hourly", "daily", "weekly", "monthly"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json("Invalid period");
    }
    const stats = await calculateStats(req.user.id, period);
    res.json(stats);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// get the leaderboard for the stats page.
router.get("/leaderboard", auth, async (req, res) => {
  try {
    const { period, friendsOnly } = req.query;

    const validPeriods = ["daily", "weekly", "monthly"];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: "Invalid period" });
    }

    const now = new Date();
    let startDate;
    if (period === "daily") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "weekly") {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const userId = req.user?._id;

    let userIdsToInclude;
    if (friendsOnly === "true") {
      const user = await User.findById(userId).select("friends");
      userIdsToInclude = [userId, ...user.friends];
    }

    const matchStage = {
      startTime: { $gte: startDate },
    };
    if (friendsOnly === "true") {
      matchStage.user = { $in: userIdsToInclude };
    }

    // finding total duration of users and formatting the output 
    const leaderboard = await StudySession.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$user",
          totalDuration: { $sum: "$duration" },
        },
      },
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
          _id: 0,
          userId: "$user._id",
          username: "$user.FirstName",
          totalDuration: 1,
        },
      },
    ]);
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: error.message });
  }
})

export const TimerSessionRoutes = router;