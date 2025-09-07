import { useFriendRequests } from "@/queries/friendQueries";
import { useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader";

export default function FriendRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: requests = [], isLoading } = useFriendRequests();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredRequests = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return requests;
    }

    return requests.filter((user) => {
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
  }, [requests, searchTerm]);

  if (isLoading) {
    // Calculate number of rows to fill viewport height
    const skeletonCardHeight = 200; // Approximate height of UserCardSkeleton including margin (adjust if needed)
    const viewportHeight = window.innerHeight;
    const rows = Math.ceil(viewportHeight / skeletonCardHeight);

    // Determine columns based on window width (Tailwind breakpoints)
    let columns = 3;
    if (window.innerWidth < 768) {
      columns = 1;
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      columns = 2;
    }

    const count = rows * columns;

    return <FriendsSkeletonLoader count={count} />;
  }

  if (!requests.length) {
    return <div className="text-center text-gray-500">No requests</div>;
  }

  return (
    <div>
      {requests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search friend requests..."
        />
      )}

      {/* 4. Update container to use CSS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mt-4">
        {filteredRequests.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="friendRequests" />
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
