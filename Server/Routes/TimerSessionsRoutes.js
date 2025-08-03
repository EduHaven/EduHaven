import express from "express";
import auth from "../Middlewares/authMiddleware.js";
import StudySession from "../Model/StudySession.js";
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

export const TimerSessionRoutes = router;
