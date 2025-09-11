// src/queries/timerQueries.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserTimerStats,
  postStudySession,
  fetchConsolidatedStats,
  fetchLeaderboard,
} from "@/api/timerApi";

// Query keys
export const timerKeys = {
  all: ["timer"],
  stats: () => [...timerKeys.all, "stats"],
  userStats: (userId) => [...timerKeys.stats(), userId || "current"],
  leaderboard: (period) => [...timerKeys.all, "leaderboard", period],
};

// Get comprehensive user stats (used by StatsSummary and Timer Stats components)
export function useUserTimerStats(userId) {
  return useQuery({
    queryKey: timerKeys.userStats(userId),
    queryFn: () => fetchUserTimerStats(userId),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

// Post study session with optimistic updates
export function usePostStudySession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postStudySession,
    onSuccess: () => {
      // Invalidate and refetch relevant queries when a new session is posted
      queryClient.invalidateQueries({ queryKey: timerKeys.all() });
    },
  });
}

export function useConsolidatedStats(userId, period = "weekly") {
  return useQuery({
    queryKey: [...timerKeys.all, "consolidated", userId || "current", period],
    queryFn: () => fetchConsolidatedStats(userId, period),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaderboard(period = "weekly", friendsOnly = false) {
  return useQuery({
    queryKey: [
      ...timerKeys.leaderboard(period),
      friendsOnly ? "friends" : "all",
    ],
    queryFn: () => fetchLeaderboard(period, friendsOnly),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
