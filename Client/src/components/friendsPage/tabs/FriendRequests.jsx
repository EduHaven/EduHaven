import { useFriendRequests } from "@/queries/friendQueries";
import { useMemo, useEffect, useState } from "react";
import UserCard from "../UserCard";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader";

export default function FriendRequests({
  searchTerm: externalSearchTerm = "",
}) {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const { data: requests = [], isLoading } = useFriendRequests();

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

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

  if (!requests.length) {
    return <div className="text-center text-gray-500">No requests</div>;
  }

  return (
    <div>
      {/* Search moved to header in MainContent */}

      <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
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
