import { useAllSuggestedUsers } from "@/queries/friendQueries";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader";

export default function SuggestedFriends() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users = [], isLoading } = useAllSuggestedUsers();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return users;
    }

    return users.filter((user) => {
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
  }, [users, searchTerm]);

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

  if (!users || users.length === 0) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredUsers.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="suggested" />
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
