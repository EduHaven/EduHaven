// Server/utils/leaderboardBadgeUpdater.js

import User from "../Model/UserModel.js";
import { BADGES, awardBadge } from "./badgeSystem.js";

/**
 * Update leaderboard badges for top 3 users.
 * Assumes you have a metric like 'totalStudyTime' to rank users.
 */
export const updateLeaderboardBadges = async () => {
  try {
    // Fetching top 3 users by leaderboard metric
    const topUsers = await User.find({})
      .sort({ totalStudyTime: -1 }) // replace with your actual leaderboard metric
      .limit(3);

    if (topUsers[0])
      await awardBadge(topUsers[0]._id, BADGES.LEADERBOARD_1.id);
    if (topUsers[1])
      await awardBadge(topUsers[1]._id, BADGES.LEADERBOARD_2.id);
    if (topUsers[2])
      await awardBadge(topUsers[2]._id, BADGES.LEADERBOARD_3.id);

    console.log("Leaderboard badges updated!");
  } catch (err) {
    console.error("Failed to update leaderboard badges:", err.message);
  }
};
