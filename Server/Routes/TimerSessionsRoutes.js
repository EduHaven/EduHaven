import express from "express";
const router = express.Router();
import authMiddleware from "../Middlewares/authMiddleware.js";
import {
  createStudySession,
  getCurrentUserStats,
  getLeaderboard,
  getUserStatsByPeriod,
} from "../Controller/StatsController.js";

// Apply authentication middleware to all event routes
router.use(authMiddleware);

// Record new session
router.post("/timer", createStudySession);

// Get statistics
router.get("/timerstats", getUserStatsByPeriod);

// Get comprehensive study statistics for current user
router.get("/user-stats", getCurrentUserStats);

// get the leaderboard for the stats page.
router.get("/leaderboard", getLeaderboard);

export const TimerSessionRoutes = router;
