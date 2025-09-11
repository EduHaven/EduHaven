import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/friends/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load friend requests");
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/accept/${friendId}`, null);
      setRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.success("Friend request accepted!");
    } catch (err) {
      console.error(err);
      toast.error("Error accepting friend request!");
    }
  };

  const rejectRequest = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/reject/${friendId}`);
      setRequests((prev) => prev.filter((r) => r._id !== friendId));
      toast.info("Friend request rejected.");
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting friend request!");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!requests.length)
    return <div className="text-center text-gray-500">No requests</div>;

  return (
    <div className="flex flex-wrap gap-3 2xl:gap-4">
      {requests.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          selectedTab="friendRequests"
          onAcceptRequest={acceptRequest}
          onRejectRequest={rejectRequest}
        />
      ))}
    </div>
  );
}
