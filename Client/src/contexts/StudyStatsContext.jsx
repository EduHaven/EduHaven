import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";

const StudyStatsContext = createContext({
  studyStats: null,
  loading: false,
  error: null,
  fetchStudyStats: () => Promise.resolve(null),
  refreshStats: () => Promise.resolve(null),
});

// Provider component
export const StudyStatsProvider = ({ children }) => {
  const [studyStats, setStudyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudyStats = async (forceRefresh = false) => {
    try {
      setError(null);
      if (!forceRefresh) {
        setLoading(true);
      }

      const response = await axiosInstance.get(`/study-sessions/user-stats`);
      const stats = response.data;

      setStudyStats({
        timePeriods: {
          today: stats.timePeriods.today,
          thisWeek: stats.timePeriods.thisWeek,
          thisMonth: stats.timePeriods.thisMonth,
          allTime: stats.timePeriods.allTime,
        },
        rank: stats.rank,
        totalUsers: stats.totalUsers,
        streak: stats.streak,
        maxStreak: stats.maxStreak,
        level: stats.level,
      });

      setLoading(false);
      return stats;
    } catch (error) {
      console.error("Error fetching study stats:", error);
      setError("Failed to load statistics");
      setLoading(false);
      return null;
    }
  };

  const refreshStats = () => {
    return fetchStudyStats(true);
  };

  // Function to refresh stats after a new study session is created
  const refreshStatsAfterSession = () => {
    // Small delay to ensure the backend has processed the new session
    setTimeout(() => {
      fetchStudyStats(true);
    }, 1000);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchStudyStats();
  }, []);

  return (
    <StudyStatsContext.Provider 
      value={{ 
        studyStats, 
        loading, 
        error, 
        fetchStudyStats, 
        refreshStats,
        refreshStatsAfterSession
      }}
    >
      {children}
    </StudyStatsContext.Provider>
  );
};

// Custom hook for using study stats context
export const useStudyStats = () => {
  const context = useContext(StudyStatsContext);
  if (!context) {
    throw new Error("useStudyStats must be used within a StudyStatsProvider");
  }
  return context;
};
