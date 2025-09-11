import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";

export default function SuggestedFriends() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/friends/friend-suggestions");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch suggestions error:", err);
      toast.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/request/${friendId}`, null);
      // mark locally
      setUsers((prev) =>
        prev.map((u) => (u._id === friendId ? { ...u, requestSent: true } : u))
      );
      toast.success("Friend request sent!");
    } catch (err) {
      console.error(err);
      toast.error("Error sending friend request!");
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;

  if (!users.length)
    return <div className="text-center text-gray-500">No suggestions</div>;

  return (
    <div className="flex flex-wrap gap-3 2xl:gap-4">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          selectedTab="suggested"
          onSendRequest={sendRequest}
        />
      ))}
    </div>
  );
}
