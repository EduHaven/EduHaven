import User from '../Model/UserModel.js';
import StudySession from '../Model/StudySession.js';

export const updateStreaks = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 🔥 ROBUST initialization with proper data types
    if (!user.streaks || typeof user.streaks !== 'object') {
      user.streaks = { current: 0, max: 0, lastStudyDate: null };
    } else {
      // Ensure numeric types and handle legacy data
      user.streaks.current = Number(user.streaks.current) || 0;
      user.streaks.max = Number(user.streaks.max) || 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Check total study time for today (at least 10 minutes required)
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todaysSessions = await StudySession.find({
      user: userId,
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const totalTodayMinutes = todaysSessions.reduce((sum, session) => sum + session.duration, 0);

    // Only update streak if user studied at least 10 minutes today
    if (totalTodayMinutes < 10) {
      return; // Don't update streak if less than 10 minutes
    }

    let lastStudyDate = user.streaks.lastStudyDate 
      ? new Date(user.streaks.lastStudyDate) 
      : null;
        
    if (lastStudyDate) {
      lastStudyDate.setHours(0, 0, 0, 0); // Start of last study day
    }

    // Check if user already studied today
    if (lastStudyDate && lastStudyDate.getTime() === today.getTime()) {
      return; // Already counted today, don't increment again
    }

    // Calculate days difference and update current streak
    if (!lastStudyDate) {
      // First time studying
      user.streaks.current = 1;
    } else {
      const daysDifference = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24));
            
      if (daysDifference === 1) {
        // Consecutive day - increment streak
        user.streaks.current += 1;
      } else if (daysDifference > 1) {
        // Gap in streak - reset to 1
        user.streaks.current = 1;
      }
      // If daysDifference === 0, it means same day (already handled above)
    }

    //Update max streak with explicit logging
    const oldMax = user.streaks.max;
    if (user.streaks.current > user.streaks.max) {
      user.streaks.max = user.streaks.current;
      console.log(`🎉 New max streak achieved! User ${userId}: ${oldMax} → ${user.streaks.max}`);
    }

    // Update last study date to today
    user.streaks.lastStudyDate = new Date();

    await user.save();
        
    console.log(`Streak updated for user ${userId}: Current=${user.streaks.current}, Max=${user.streaks.max}`);
      
  } catch (error) {
    console.error('Error updating streaks:', error);
  }
};

// Function to check and reset streaks for users who haven't studied
export const checkAndResetStreaks = async () => {
  try {
    const users = await User.find({ 
      'streaks.current': { $gt: 0 },
      'streaks.lastStudyDate': { $exists: true }
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    for (const user of users) {
      const lastStudyDate = new Date(user.streaks.lastStudyDate);
      lastStudyDate.setUTCHours(0, 0, 0, 0);
      
      // Ensure current and max are numbers
      const current = user.streaks.current || 0;
      const max = user.streaks.max || 0;

      if (lastStudyDate < yesterday) {
        // Save max streak if needed before reset
        if (current > max) {
          user.streaks.max = current;
        }

        user.streaks.current = 0;

        await user.save();
        console.log(`Reset streak for user ${user._id} - last study: ${lastStudyDate.toISOString().split('T')[0]}, max: ${user.streaks.max}`);
      }
    }
  } catch (error) {
    console.error('Error checking and resetting streaks:', error);
  }
};