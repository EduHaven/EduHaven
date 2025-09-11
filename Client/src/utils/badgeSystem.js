// Badge definitions and achievement logic
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
  // Future badges can be added here
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
  
  return requiredFields.every(field => {
    const value = user[field];
    return value !== null && value !== undefined && value !== '';
  });
};

// Function to check badge achievements
export const checkBadgeAchievements = (user, goals = []) => {
  const earnedBadges = [];
  
  // Check Rookie badge
  if (isProfileComplete(user)) {
    earnedBadges.push(BADGES.ROOKIE);
  }
  
  // Check Kickstarter badge
  const completedGoals = goals.filter(goal => goal.status === 'closed' || goal.completed === true);
  if (completedGoals.length > 0) {
    earnedBadges.push(BADGES.KICKSTARTER);
  }
  
  return earnedBadges;
};

// Get all available badges
export const getAllBadges = () => {
  return Object.values(BADGES);
};

// Save earned badges to localStorage with individual timestamps
export const saveBadgesToStorage = (userId, badges) => {
  const key = `badges_${userId}`;
  const existingData = loadBadgeDataFromStorage(userId);
  
  // Create badge data with timestamps for new badges
  const badgeData = {
    badges: badges.map(badge => {
      // Check if this badge already has a timestamp
      const existingBadge = existingData.badges.find(b => b.id === badge.id);
      return {
        ...badge,
        earnedAt: existingBadge ? existingBadge.earnedAt : Date.now()
      };
    }),
    lastUpdated: Date.now()
  };
  
  localStorage.setItem(key, JSON.stringify(badgeData));
};

// Load badge data from localStorage (internal function)
const loadBadgeDataFromStorage = (userId) => {
  const key = `badges_${userId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Handle both old format (array) and new format (object with badges array)
      if (Array.isArray(data)) {
        return {
          badges: data.map(badge => ({ ...badge, earnedAt: Date.now() })), // Migrate old data
          lastUpdated: Date.now()
        };
      }
      return data;
    } catch (error) {
      console.error('Error parsing stored badges:', error);
      return { badges: [], lastUpdated: Date.now() };
    }
  }
  return { badges: [], lastUpdated: Date.now() };
};

// Load earned badges from localStorage
export const loadBadgesFromStorage = (userId) => {
  const data = loadBadgeDataFromStorage(userId);
  return data.badges.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    category: badge.category
  }));
};

// Check if a new badge was earned (for notifications)
export const getNewlyEarnedBadges = (previousBadges, currentBadges, userId) => {
  const previousIds = previousBadges.map(badge => badge.id);
  const newBadges = currentBadges.filter(badge => !previousIds.includes(badge.id));
  
  // If there are new badges, check their timestamps to ensure they're actually new
  if (newBadges.length > 0 && userId) {
    const badgeData = loadBadgeDataFromStorage(userId);
    const now = Date.now();
    const recentThreshold = 5000; // 5 seconds threshold for "new" badges
    
    // Only return badges that were earned very recently
    return newBadges.filter(badge => {
      const storedBadge = badgeData.badges.find(b => b.id === badge.id);
      if (storedBadge && storedBadge.earnedAt) {
        return (now - storedBadge.earnedAt) < recentThreshold;
      }
      return false; // If no timestamp, don't notify
    });
  }
  
  return newBadges;
};

// Get the most recently earned badge
export const getMostRecentBadge = (userId) => {
  const badgeData = loadBadgeDataFromStorage(userId);
  if (badgeData.badges.length === 0) return null;
  
  // Sort badges by earnedAt timestamp and return the most recent
  const sortedBadges = badgeData.badges.sort((a, b) => (b.earnedAt || 0) - (a.earnedAt || 0));
  return sortedBadges[0];
};
