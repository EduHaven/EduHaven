import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import UserCard from "../UserCard";
import SearchBar from "../SearchBar";
import { FriendsListSkeleton } from "../skeletons/UserCardSkeleton";

export default function SentRequests() {
  const [sent, setSent] = useState([]);
  const [filteredSent, setFilteredSent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Changed to true initially

  const fetchSent = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axiosInstance.get(`/friends/sent-requests`),
        new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds delay
      ]);
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

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSent(sent);
      return;
    }

    const filtered = sent.filter((user) => {
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

    setFilteredSent(filtered);
  };

  useEffect(() => {
    fetchSent();
  }, []);

  useEffect(() => {
    setFilteredSent(sent);
  }, [sent]);

  if (loading)
    return <FriendsListSkeleton showSearch={true} cardCount={12} />;
  if (!sent.length)
    return <div className="text-center text-gray-500">No sent requests</div>;

  return (
    <div>
      {sent.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search sent requests..."
        />
      )}

      <div className="flex flex-wrap gap-3 2xl:gap-4 mt-4">
        {filteredSent.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            selectedTab="sentRequests"
            onCancelRequest={cancelRequest}
          />
        ))}
      </div>

      {filteredSent.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching sent requests found
        </div>
      )}
    </div>
  );
}
