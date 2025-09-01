import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import { FriendsListSkeleton } from "../skeletons/UserCardSkeleton";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Changed to true initially

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axiosInstance.get("/friends/requests"),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds delay
      ]);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter((user) => {
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

    setFilteredRequests(filtered);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    setFilteredRequests(requests);
  }, [requests]);

  if (loading)
    return <FriendsListSkeleton showSearch={true} cardCount={12} />;
  if (!requests.length)
    return <div className="text-center text-gray-500">No requests</div>;

  return (
    <div>
      {requests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search friend requests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredRequests.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="friendRequests"
            onAcceptRequest={acceptRequest}
            onRejectRequest={rejectRequest}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching friend requests found
        </div>
      )}
    </div>
  );
}
