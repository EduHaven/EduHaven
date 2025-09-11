import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";

export default function SentRequests() {
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSent = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/friends/sent-requests`);
      setSent(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sent requests");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/sent-requests/${friendId}`);
      setSent((prev) => prev.filter((r) => r._id !== friendId));
      toast.info("Friend request canceled.");
    } catch (err) {
      console.error(err);
      toast.error("Error canceling friend request!");
    }
  };

  useEffect(() => {
    fetchSent();
  }, []);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (!sent.length) return <div className="text-center text-gray-500">No sent requests</div>;

  return (
    <div className="flex flex-wrap gap-3 2xl:gap-4">
      {sent.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          selectedTab="sentRequests"
          onCancelRequest={cancelRequest}
        />
      ))}
    </div>
  );
}
