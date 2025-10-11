import { handleApiError } from "@/utils/errorHandler";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  fetchAllFriends,
  fetchAllSuggestedUsers,
  fetchFriendRequests,
  fetchSentRequests,
  fetchSuggestedUsers,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../api/friendApi";

export const useFriendRequests = () =>
  useQuery({
    queryKey: ["friendRequests"],
    queryFn: fetchFriendRequests,
    staleTime: 1000 * 60,
    onError: (err) => handleApiError(err, "Error fetching friend requests"),
  });

export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      qc.invalidateQueries({ queryKey: ["friendRequests"] });
      qc.invalidateQueries({ queryKey: ["friends"] }); // refresh friends
    },
    onError: (err) => handleApiError(err, "Error accepting friend request"),
  });
};

export const useRejectRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.info("Friend request rejected.");
      qc.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (err) => handleApiError(err, "Error rejecting friend request"),
  });
};

export const useSentRequests = () =>
  useQuery({
    queryKey: ["sentRequests"],
    queryFn: fetchSentRequests,
    staleTime: 1000 * 60,
    onError: (err) => handleApiError(err, "Error fetching sent requests"),
  });

export const useCancelRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: (_, userId) => {
      toast.info("Friend request canceled.");

      qc.setQueryData(["friendSuggestions"], (old = []) =>
        old.map((u) => (u._id === userId ? { ...u, requestSent: false } : u))
      );

      qc.invalidateQueries({ queryKey: ["sentRequests"] });
    },
    onError: (err) => handleApiError(err, "Error canceling friend request!"),
  });
};

export const useFriends = () =>
  useQuery({
    queryKey: ["friends"],
    queryFn: fetchAllFriends,
    staleTime: 1000 * 60 * 10,
    onError: (err) => handleApiError(err, "Error fetching friends"),
  });

export const useRemoveFriend = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed!");
      qc.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (err) => handleApiError(err, "Error removing friend!"),
  });
};

export const useUsersInfinite = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      fetchSuggestedUsers({ page: pageParam, limit }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

export const useAllSuggestedUsers = (searchTerm) => {
  return useInfiniteQuery({
    queryKey: ["suggestedUsers", searchTerm],
    queryFn: fetchAllSuggestedUsers,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    onError: (err) => handleApiError(err, "Error fetching suggested users"),
  });
};

export const useSendRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, userId) => {
      toast.success("Friend request sent!");

      qc.setQueryData(["friendSuggestions"], (old = []) =>
        old.map((u) => (u._id === userId ? { ...u, requestSent: true } : u))
      );

      qc.invalidateQueries({ queryKey: ["sentRequests"] });
    },
    onError: (err) => handleApiError(err, "Error sending friend request!"),
  });
};
