import User from "../Model/UserModel.js";
import StudySession from "../Model/StudySession.js";
import mongoose from "mongoose";

export const updateStreaks = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  if (!user.streaks) {
    user.streaks = { current: 0, max: 0, lastStudyDate: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let lastStudyDay = user.streaks.lastStudyDate
    ? new Date(user.streaks.lastStudyDate)
    : null;

  if (lastStudyDay) lastStudyDay.setHours(0, 0, 0, 0);

  // Fetch all study sessions for today
  const sessionsToday = await StudySession.find({
    user: new mongoose.Types.ObjectId(userId),
    startTime: { $gte: today },
  });

  // Find max duration of sessions today
  const maxDuration = sessionsToday.reduce(
    (max, session) => Math.max(max, session.duration || 0),
    0
  );

  if (maxDuration >= 10) {
    // User studied enough today → update streak
    if (!lastStudyDay) {
      user.streaks.current = 1;
    } else {
      const diffDays = Math.floor((today - lastStudyDay) / 86400000);

      if (diffDays === 1) {
        // Consecutive day → increment streak
        user.streaks.current += 1;
      } else if (diffDays > 1) {
        // Missed one or more days → reset streak
        user.streaks.current = 1;
      } // diffDays === 0 → same day, do nothing
    }
    user.streaks.lastStudyDate = today;
  } else {
    // Did not study enough today → reset streak if missed a day
    if (lastStudyDay) {
      const diffDays = Math.floor((today - lastStudyDay) / 86400000);
      if (diffDays > 1) {
        user.streaks.current = 0;
      }
    } else {
      user.streaks.current = 0;
    }
  }

  // Update max streak if needed
  if (user.streaks.current > user.streaks.max) {
    user.streaks.max = user.streaks.current;
  }

  await user.save();
};
