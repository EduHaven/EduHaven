import { useSentRequests } from "@/queries/friendQueries";
import { useMemo, useState } from "react";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";

export default function SentRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: sentRequests = [], isLoading } = useSentRequests();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredSent = useMemo(() => {
    const term = searchTerm;
    if (!term.trim()) {
      return sentRequests;
    }

    return sentRequests.filter((user) => {
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
  }, [sentRequests, searchTerm]);

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

  if (sentRequests.length == 0) {
    return <div className="text-center text-gray-500">No sent requests</div>;
  }

  return (
    <div>
      {sentRequests.length > 0 && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search sent requests..."
        />
      )}

      <div className="flex flex-wrap gap-4 mt-4 justify-start">
        {filteredSent?.map((user) => (
          <UserCard key={user._id} user={user} selectedTab="sentRequests" />
        ))}
      </div>

      {filteredSent?.length === 0 && searchTerm && (
        <div className="text-center text-gray-500 mt-4">
          No matching sent requests found
        </div>
      )}
    </div>
  );
}
