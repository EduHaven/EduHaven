import axiosInstance from "@/utils/axios";

// Post a new study session
export const postStudySession = async (sessionData) => {
  const response = await axiosInstance.post("/study-sessions", sessionData);
  return response.data;
};

// Get user timer stats
export const fetchUserTimerStats = async (userId) => {
  const response = await axiosInstance.get(
    `/study-sessions/user-stats${userId ? `/${userId}` : ""}`
  );
  return response.data;
};

// Get consolidated stats with period parameter
export const fetchConsolidatedStats = async (userId, period = "weekly") => {
  const response = await axiosInstance.get(
    `/study-sessions/consolidated-stats${userId ? `/${userId}` : ""}?period=${period}`
  );
  return response.data;
};

// Get leaderboard data
export const fetchLeaderboard = async (
  period = "weekly",
  friendsOnly = false
) => {
  const response = await axiosInstance.get(
    `/study-sessions/leaderboard?period=${period}&friendsOnly=${friendsOnly}`
  );
  return response.data;
};
