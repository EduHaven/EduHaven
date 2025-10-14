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
    return <FriendsSkeletonLoader />;
  }

  const hasRequests = requests.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[var(--txt)]">
          Friend Requests
        </h2>
        {hasRequests && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search friend requests..."
            className="mb-0 sm:max-w-sm lg:max-w-md"
          />
        )}
      </div>

      {!hasRequests && (
        <div className="text-center text-gray-500">No requests</div>
      )}

      {hasRequests && (
        <>
          <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
            {filteredRequests.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                selectedTab="friendRequests"
              />
            ))}
          </div>

          {filteredRequests.length === 0 && searchTerm && (
            <div className="text-center text-gray-500 mt-4">
              No matching friend requests found
            </div>
          )}
        </>
      )}
    </div>
  );
}
