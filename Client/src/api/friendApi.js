import axiosInstance from "@/utils/axios";

export const fetchFriendRequests = async () => {
  const res = await axiosInstance.get("/friends/requests");
  return res.data || [];
};

export const acceptFriendRequest = async (friendId) => {
  const res = await axiosInstance.post(`/friends/accept/${friendId}`, null);
  return res.data;
};

export const rejectFriendRequest = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/reject/${friendId}`);
  return res.data;
};

export const fetchSentRequests = async () => {
  const res = await axiosInstance.get("/friends/sent-requests");
  return res.data || [];
};

export const cancelFriendRequest = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/sent-requests/${friendId}`);
  return res.data;
};

export const fetchAllFriends = async () => {
  const res = await axiosInstance.get("/friends");
  return res.data || [];
};

export const removeFriend = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/${friendId}`);
  return res.data;
};

export const fetchSuggestedUsers = async ({ page = 1, limit = 20 }) => {
  const { data } = await axiosInstance.get("/friends/friend-suggestions", {
    params: { page, limit },
  });
  return data;
};

export const fetchAllSuggestedUsers = async () => {
  const { data } = await axiosInstance.get("/friends/friend-suggestions", {
    params: { all: true },
  });
  return data;
};

export const sendFriendRequest = async (friendId) => {
  const res = await axiosInstance.post(`/friends/request/${friendId}`, null);
  return res.data;
};
