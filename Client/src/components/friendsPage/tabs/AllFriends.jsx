import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import { FriendsListSkeleton } from "../skeletons/UserCardSkeleton";

export default function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Changed to true initially

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axiosInstance.get(`/friends`),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds delay
      ]);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredFriends(friends);
      return;
    }

    const filtered = friends.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();

      // Search by name
      if (fullName.includes(term.toLowerCase())) {
        return true;
      }

      // Search by skills
      if (
        user.OtherDetails?.skills &&
        user.OtherDetails.skills.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }

      // Search by interests
      if (
        user.OtherDetails?.interests &&
        user.OtherDetails.interests.toLowerCase().includes(term.toLowerCase())
      ) {
        return true;
      }

      return false;
    });

    setFilteredFriends(filtered);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  if (loading)
    return <FriendsListSkeleton showSearch={true} cardCount={12} />;
  if (!friends.length)
    return <div className="text-center text-gray-500">No friends yet</div>;

  return (
    <div>
      {friends.length > 0 && (
        <SearchBar onSearch={handleSearch} placeholder="Search friends..." />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredFriends.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="allFriends"
            onRemoveFriend={removeFriend}
          />
        ))}
      </div>

      {filteredFriends.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friends found
        </div>
      )}
    </div>
  );
}
