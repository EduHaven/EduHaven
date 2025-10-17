// Badge definitions and awarding logic for backend
import User from "../Model/UserModel.js";

// Badge definitions
export const BADGES = {
  ROOKIE: {
    id: "rookie",
    name: "Rookie",
    description: "Achieved by completing their full profile for first time",
    icon: "/badges/Rookie.png",
    category: "Profile",
  },
  KICKSTARTER: {
    id: "kickstarter",
    name: "Kickstarter",
    description: "Achieved by completing first goal",
    icon: "/badges/First Step.png",
    category: "Goals",
  },
  CONSISTENCY_STARTER: {
    id: "consistency_starter",
    name: "Consistency Starter",
    description: "Achieved by maintaining a 7-day study streak",
    icon: "/badges/Consistency Starter.png",
    category: "Streak",
  },
  FOCUS_ENTHUSIAST: {
    id: "focus_enthusiast",
    name: "Focus Enthusiast",
    description: "Achieved by completing 10 focus sessions",
    icon: "/badges/Focus Enthusiast.png",
    category: "Focus",
  },
  LEADERBOARD_1: {
    id: "leaderboard_1",
    name: "Top 1",
    description: "Awarded for being 1st on the leaderboard",
    icon: "/badges/Top1.png",
    category: "Leaderboard",
  },
  LEADERBOARD_2: {
    id: "leaderboard_2",
    name: "Top 2",
    description: "Awarded for being 2nd on the leaderboard",
    icon: "/badges/Top2.png",
    category: "Leaderboard",
  },
  LEADERBOARD_3: {
    id: "leaderboard_3",
    name: "Top 3",
    description: "Awarded for being 3rd on the leaderboard",
    icon: "/badges/Top3.png",
    category: "Leaderboard",
  },
};

// Function to check if user profile is complete
export const isProfileComplete = (user) => {
  const requiredFields = [
    "FirstName",
    "LastName",
    "Email",
    "Bio",
    "Gender",
    "University",
    "Country",
    "FieldOfStudy",
    "GraduationYear",
  ];

  const incompleteFields = [];
  const isComplete = requiredFields.every((field) => {
    const value = user[field];
    const isEmpty = value === null || value === undefined || value === "";
    if (isEmpty) incompleteFields.push(field);
    return !isEmpty;
  });

  return isComplete;
};

// Check if user already has a specific badge
export const hasBadge = (user, badgeId) => {
  return user.badges && user.badges.some((badge) => badge.id === badgeId);
};

// Award a badge to a user
export const awardBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    const badgeDefinition = Object.values(BADGES).find(
      (badge) => badge.id === badgeId
    );
    if (!badgeDefinition) return { success: false, error: "Badge definition not found" };

    if (hasBadge(user, badgeId)) return { success: false, error: "Badge already earned" };

    const newBadge = {
      id: badgeDefinition.id,
      name: badgeDefinition.name,
      description: badgeDefinition.description,
      icon: badgeDefinition.icon,
      earnedAt: new Date(),
    };

    user.badges.push(newBadge);
    await user.save();

    return { success: true, badge: newBadge };
  } catch (error) {
    console.error("Error awarding badge:", error);
    return { success: false, error: error.message };
  }
};

// Check and award Rookie badge
export const checkAndAwardRookieBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    const profileComplete = isProfileComplete(user);
    const alreadyHasBadge = hasBadge(user, BADGES.ROOKIE.id);

    if (profileComplete && !alreadyHasBadge) {
      return await awardBadge(userId, BADGES.ROOKIE.id);
    }

    return { success: false, error: "Badge criteria not met or already earned" };
  } catch (error) {
    console.error("Error checking Rookie badge:", error);
    return { success: false, error: error.message };
  }
};

// Check and award Kickstarter badge
export const checkAndAwardKickstarterBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    const { default: Task } = await import("../Model/ToDoModel.js");

    const completedGoals = await Task.find({
      user: userId,
      $or: [{ status: "closed" }, { completed: true }],
    });

    if (completedGoals.length > 0 && !hasBadge(user, BADGES.KICKSTARTER.id)) {
      return await awardBadge(userId, BADGES.KICKSTARTER.id);
    }

    return { success: false, error: "Badge criteria not met or already earned" };
  } catch (error) {
    console.error("Error checking Kickstarter badge:", error);
    return { success: false, error: error.message };
  }
};

// Check and award Consistency Starter badge
export const checkAndAwardConsistencyBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    if (
      user.streaks &&
      user.streaks.current >= 7 &&
      !hasBadge(user, BADGES.CONSISTENCY_STARTER.id)
    ) {
      return await awardBadge(userId, BADGES.CONSISTENCY_STARTER.id);
    }

    return { success: false, error: "Badge criteria not met or already earned" };
  } catch (error) {
    console.error("Error checking Consistency badge:", error);
    return { success: false, error: error.message };
  }
};

// Check and award Focus Enthusiast badge
export const checkAndAwardFocusBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    return { success: false, error: "Badge criteria not met or already earned" };
  } catch (error) {
    console.error("Error checking Focus badge:", error);
    return { success: false, error: error.message };
  }
};

// Check all possible badges for a user
export const checkAllBadges = async (userId) => {
  const results = [];

  const rookieResult = await checkAndAwardRookieBadge(userId);
  if (rookieResult.success) results.push(rookieResult.badge);

  const kickstarterResult = await checkAndAwardKickstarterBadge(userId);
  if (kickstarterResult.success) results.push(kickstarterResult.badge);

  const consistencyResult = await checkAndAwardConsistencyBadge(userId);
  if (consistencyResult.success) results.push(consistencyResult.badge);

  const focusResult = await checkAndAwardFocusBadge(userId);
  if (focusResult.success) results.push(focusResult.badge);

  return results;
};
