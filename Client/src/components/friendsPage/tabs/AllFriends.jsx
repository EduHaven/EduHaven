import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";

export default function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/friends`);
      setFriends(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/${friendId}`);
      setFriends((prev) => prev.filter((f) => f._id !== friendId));
      toast.success("Friend removed!");
    } catch (err) {
      console.error(err);
      toast.error("Error removing friend!");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (!friends.length)
    return <div className="text-center text-gray-500">No friends yet</div>;

  return (
    <div className="flex flex-wrap gap-3 2xl:gap-4">
      {friends.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          selectedTab="allFriends"
          onRemoveFriend={removeFriend}
        />
      ))}
    </div>
  );
}
