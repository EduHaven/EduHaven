import { useFriends } from "@/queries/friendQueries";
import { useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader"; // 1. Import skeleton loader

export default function AllFriends() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: friends = [], isLoading } = useFriends();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredFriends = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return friends;
    }

    return friends.filter((user) => {
      const fullName = `${user.FirstName} ${user.LastName || ""}`.toLowerCase();
      if (fullName.includes(term.toLowerCase())) return true;
      if (user.OtherDetails?.skills?.toLowerCase().includes(term.toLowerCase()))
        return true;
      if (
        user.OtherDetails?.interests?.toLowerCase().includes(term.toLowerCase())
      )
        return true;
      return false;
    });
  }, [friends, searchTerm]);

  // 3. Render skeleton loader while loading
  if (isLoading) {
    return <FriendsSkeletonLoader />;
  }

  if (friends.length === 0) {
    return <div className="text-center text-gray-500">No friends yet</div>;
  }

  return (
    <div>
      {friends.length > 0 && (
        <SearchBar onSearch={handleSearch} placeholder="Search friends..." />
      )}

      <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
        {filteredFriends.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="allFriends" />
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
