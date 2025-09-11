// Badge definitions and awarding logic for backend
import User from '../Model/UserModel.js';

// Badge definitions
export const BADGES = {
  ROOKIE: {
    id: 'rookie',
    name: 'Rookie',
    description: 'Achieved by completing their full profile for first time',
    icon: '/badges/Rookie.png',
    category: 'Profile'
  },
  KICKSTARTER: {
    id: 'kickstarter',
    name: 'Kickstarter',
    description: 'Achieved by completing first goal',
    icon: '/badges/First Step.png',
    category: 'Goals'
  },
  CONSISTENCY_STARTER: {
    id: 'consistency_starter',
    name: 'Consistency Starter',
    description: 'Achieved by maintaining a 7-day study streak',
    icon: '/badges/Consistency Starter.png',
    category: 'Streak'
  },
  FOCUS_ENTHUSIAST: {
    id: 'focus_enthusiast',
    name: 'Focus Enthusiast',
    description: 'Achieved by completing 10 focus sessions',
    icon: '/badges/Focus Enthusiast.png',
    category: 'Focus'
  },
  STREAK_30_DAYS: {
    id: 'streak_30_days',
    name: '30 Day Streak',
    description: 'Achieved by maintaining a 30-day study streak',
    icon: '/badges/30_day_streak.png',
    category: 'Streak'
  },
  STREAK_100_DAYS: {
    id: 'streak_100_days',
    name: '100 Day Streak',
    description: 'Achieved by maintaining a 100-day study streak',
    icon: '/badges/100_day_streak.png',
    category: 'Streak'
  },
  STREAK_200_DAYS: {
    id: 'streak_200_days',
    name: '200 Day Streak',
    description: 'Achieved by maintaining a 200-day study streak',
    icon: '/badges/200_day_streak.png',
    category: 'Streak'
  }
};

// Function to check if user profile is complete
export const isProfileComplete = (user) => {
  console.log('Checking profile completion for user:', user.FirstName);
  
  const requiredFields = [
    'FirstName',
    'LastName',
    'Email',
    'Bio',
    'Gender',
    'University',
    'Country',
    'FieldOfStudy',
    'GraduationYear'
  ];
  
  const incompleteFields = [];
  const isComplete = requiredFields.every(field => {
    const value = user[field];
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
      incompleteFields.push(field);
    }
    return !isEmpty;
  });
  
  console.log('Profile completion check:', {
    isComplete,
    incompleteFields,
    userFields: Object.keys(user)
  });
  
  return isComplete;
};

// Check if user already has a specific badge
export const hasBadge = (user, badgeId) => {
  return user.badges && user.badges.some(badge => badge.id === badgeId);
};

// Award a badge to a user
export const awardBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for badge awarding:', userId);
      return { success: false, error: 'User not found' };
    }

    // Check if badge exists
    const badgeDefinition = Object.values(BADGES).find(badge => badge.id === badgeId);
    if (!badgeDefinition) {
      console.error('Badge definition not found:', badgeId);
      return { success: false, error: 'Badge definition not found' };
    }

    // Check if user already has this badge
    if (hasBadge(user, badgeId)) {
      return { success: false, error: 'Badge already earned' };
    }

    // Add badge to user
    const newBadge = {
      id: badgeDefinition.id,
      name: badgeDefinition.name,
      description: badgeDefinition.description,
      icon: badgeDefinition.icon,
      earnedAt: new Date()
    };

    user.badges.push(newBadge);
    await user.save();

    console.log(`Badge ${badgeId} awarded to user ${userId}`);
    return { success: true, badge: newBadge };
  } catch (error) {
    console.error('Error awarding badge:', error);
    return { success: false, error: error.message };
  }
};

// Check and award Rookie badge (profile completion)
export const checkAndAwardRookieBadge = async (userId) => {
  try {
    console.log('Checking Rookie badge for user:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for Rookie badge check');
      return { success: false, error: 'User not found' };
    }

    console.log('User found, checking profile completion...');
    const profileComplete = isProfileComplete(user);
    const alreadyHasBadge = hasBadge(user, BADGES.ROOKIE.id);
    
    console.log('Rookie badge check results:', {
      profileComplete,
      alreadyHasBadge,
      userBadges: user.badges
    });

    // Check if profile is complete and badge not already awarded
    if (profileComplete && !alreadyHasBadge) {
      console.log('Awarding Rookie badge...');
      return await awardBadge(userId, BADGES.ROOKIE.id);
    }

    return { success: false, error: 'Badge criteria not met or already earned' };
  } catch (error) {
    console.error('Error checking Rookie badge:', error);
    return { success: false, error: error.message };
  }
};

// Check and award Kickstarter badge (first goal completion)
export const checkAndAwardKickstarterBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: 'User not found' };

    // Import Task model to query user's tasks
    const { default: Task } = await import('../Model/ToDoModel.js');
    
    // Check if user has completed at least one goal and badge not already awarded
    const completedGoals = await Task.find({
      user: userId,
      $or: [
        { status: 'closed' },
        { completed: true }
      ]
    });
    
    if (completedGoals.length > 0 && !hasBadge(user, BADGES.KICKSTARTER.id)) {
      return await awardBadge(userId, BADGES.KICKSTARTER.id);
    }

    return { success: false, error: 'Badge criteria not met or already earned' };
  } catch (error) {
    console.error('Error checking Kickstarter badge:', error);
    return { success: false, error: error.message };
  }
};

// Check and award Consistency Starter badge (7-day streak)
export const checkAndAwardConsistencyBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: 'User not found' };

    // Check if user has a 7+ day streak and badge not already awarded
    if (user.streaks && user.streaks.current >= 7 && !hasBadge(user, BADGES.CONSISTENCY_STARTER.id)) {
      return await awardBadge(userId, BADGES.CONSISTENCY_STARTER.id);
    }

    return { success: false, error: 'Badge criteria not met or already earned' };
  } catch (error) {
    console.error('Error checking Consistency badge:', error);
    return { success: false, error: error.message };
  }
};

// Check and award Focus Enthusiast badge (10 focus sessions)
export const checkAndAwardFocusBadge = async (userId) => {
  try {
    // You'll need to implement this based on your focus session tracking
    // For now, this is a placeholder
    const user = await User.findById(userId);
    if (!user) return { success: false, error: 'User not found' };

    // TODO: Implement focus session counting logic
    // const focusSessions = await getFocusSessionCount(userId);
    // if (focusSessions >= 10 && !hasBadge(user, BADGES.FOCUS_ENTHUSIAST.id)) {
    //   return await awardBadge(userId, BADGES.FOCUS_ENTHUSIAST.id);
    // }

    return { success: false, error: 'Badge criteria not met or already earned' };
  } catch (error) {
    console.error('Error checking Focus badge:', error);
    return { success: false, error: error.message };
  }
};

// Check and award streak badges (30, 100, 200 days)
export const checkAndAwardStreakBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return { success: false, error: 'User not found' };

    const awardedBadges = [];
    
    if (user.streaks && user.streaks.current) {
      const currentStreak = user.streaks.current;
      
      // Check for 30-day streak badge
      if (currentStreak >= 30 && !hasBadge(user, BADGES.STREAK_30_DAYS.id)) {
        const result = await awardBadge(userId, BADGES.STREAK_30_DAYS.id);
        if (result.success) awardedBadges.push(result.badge);
      }
      
      // Check for 100-day streak badge
      if (currentStreak >= 100 && !hasBadge(user, BADGES.STREAK_100_DAYS.id)) {
        const result = await awardBadge(userId, BADGES.STREAK_100_DAYS.id);
        if (result.success) awardedBadges.push(result.badge);
      }
      
      // Check for 200-day streak badge
      if (currentStreak >= 200 && !hasBadge(user, BADGES.STREAK_200_DAYS.id)) {
        const result = await awardBadge(userId, BADGES.STREAK_200_DAYS.id);
        if (result.success) awardedBadges.push(result.badge);
      }
    }

    return { 
      success: awardedBadges.length > 0, 
      badges: awardedBadges,
      error: awardedBadges.length === 0 ? 'Badge criteria not met or already earned' : null
    };
  } catch (error) {
    console.error('Error checking streak badges:', error);
    return { success: false, error: error.message };
  }
};

// Check all possible badges for a user
export const checkAllBadges = async (userId) => {
  const results = [];
  
  // Check each badge type
  const rookieResult = await checkAndAwardRookieBadge(userId);
  if (rookieResult.success) results.push(rookieResult.badge);
  
  const kickstarterResult = await checkAndAwardKickstarterBadge(userId);
  if (kickstarterResult.success) results.push(kickstarterResult.badge);
  
  const consistencyResult = await checkAndAwardConsistencyBadge(userId);
  if (consistencyResult.success) results.push(consistencyResult.badge);
  
  const focusResult = await checkAndAwardFocusBadge(userId);
  if (focusResult.success) results.push(focusResult.badge);
  
  // Check streak badges
  const streakResult = await checkAndAwardStreakBadges(userId);
  if (streakResult.success && streakResult.badges) {
    results.push(...streakResult.badges);
  }
  
  return results;
};
