import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import { FriendsListSkeleton } from "../skeletons/UserCardSkeleton";

export default function SuggestedFriends() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Changed to true initially

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // Add minimum loading time for testing
      const [res] = await Promise.all([
        axiosInstance.get("/friends/friend-suggestions?all=true"),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds delay
      ]);
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
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === friendId ? { ...u, requestSent: true } : u))
      );
      toast.success("Friend request sent!");
    } catch (err) {
      console.error(err);
      toast.error("Error sending friend request!");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) => {
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

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Show skeleton while loading
  if (loading) {
    return <FriendsListSkeleton showSearch={true} cardCount={12} />;
  }
  
  // Show no suggestions message
  if (!users.length) {
    return <div className="text-center text-gray-500">No suggestions</div>;
  }

  return (
    <div>
      {users.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, skills, or interests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="suggested"
            onSendRequest={sendRequest}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friends found
        </div>
      )}
    </div>
  );
}
