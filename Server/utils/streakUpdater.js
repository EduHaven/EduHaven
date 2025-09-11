import User from '../Model/UserModel.js';
import StudySession from '../Model/StudySession.js';
import mongoose from 'mongoose';
import { checkAndAwardStreakBadges } from './badgeSystem.js';

export const updateStreaks = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Initialize streaks if not exists
    if (!user.streaks) {
      user.streaks = { current: 0, max: 0, lastStudyDate: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Calculate total study time for today
    const todayStudyTime = await StudySession.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          startTime: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$duration" }
        }
      }
    ]);

    const totalMinutesToday = todayStudyTime[0]?.totalMinutes || 0;

    // Only proceed if user has studied at least 10 minutes today
    if (totalMinutesToday < 10) {
      return; // Don't update streak yet, wait for more study time
    }

    const lastStudyDay = user.streaks.lastStudyDate 
      ? new Date(user.streaks.lastStudyDate) 
      : null;

    if (lastStudyDay) {
      lastStudyDay.setHours(0, 0, 0, 0);
    }

    // Check if this is the first qualifying day for today
    const isTodayAlreadyCounted = lastStudyDay && 
      lastStudyDay.getTime() === today.getTime();

    if (isTodayAlreadyCounted) {
      return; // Already counted today's streak
    }

    if (!lastStudyDay) {
      // First time studying - start streak
      user.streaks.current = 1;
    } else {
      const daysDifference = Math.floor((today.getTime() - lastStudyDay.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDifference === 1) {
        // Consecutive day - increment streak
        user.streaks.current += 1;
      } else if (daysDifference > 1) {
        // Missed days - reset streak
        user.streaks.current = 1;
      }
      // If daysDifference === 0, it means same day (already handled above)
    }

    // Update max streak if current is higher
    if (user.streaks.current > user.streaks.max) {
      user.streaks.max = user.streaks.current;
    }

    // Update last study date to today
    user.streaks.lastStudyDate = new Date(today);
    await user.save();

    console.log(`Streak updated for user ${userId}: Current=${user.streaks.current}, Max=${user.streaks.max}`);
    
    // Check for streak badges after updating the streak
    try {
      const streakBadgeResult = await checkAndAwardStreakBadges(userId);
      if (streakBadgeResult.success && streakBadgeResult.badges && streakBadgeResult.badges.length > 0) {
        console.log(`Streak badges awarded to user ${userId}:`, streakBadgeResult.badges.map(b => b.name));
      }
    } catch (badgeError) {
      console.error('Error checking streak badges:', badgeError);
    }
  } catch (error) {
    console.error('Error updating streaks:', error);
  }
};

// Function to check and reset streaks for users who missed studying yesterday
export const checkAndResetStreaks = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find users who had a streak but didn't study yesterday (and it wasn't already reset)
    const usersWithStreaks = await User.find({
      'streaks.current': { $gt: 0 },
      'streaks.lastStudyDate': { $lt: yesterday }
    });

    for (const user of usersWithStreaks) {
      const lastStudyDay = new Date(user.streaks.lastStudyDate);
      lastStudyDay.setHours(0, 0, 0, 0);

      const daysSinceLastStudy = Math.floor((today.getTime() - lastStudyDay.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastStudy > 1) {
        user.streaks.current = 0;
        await user.save();
        console.log(`Reset streak for user ${user._id} due to ${daysSinceLastStudy} days without studying`);
      }
    }
  } catch (error) {
    console.error('Error checking and resetting streaks:', error);
  }
};
