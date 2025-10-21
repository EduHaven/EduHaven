import { useSentRequests } from "@/queries/friendQueries";
import { useMemo, useEffect, useState } from "react";
import FriendsSkeletonLoader from "../../skeletons/FriendsSkeletonLoader";
import UserCard from "../UserCard";

export default function SentRequests({ searchTerm: externalSearchTerm = "" }) {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);
  const { data: sentRequests = [], isLoading } = useSentRequests();

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

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
    return <FriendsSkeletonLoader />;
  }

  if (sentRequests.length == 0) {
    return <div className="text-center text-gray-500">No sent requests</div>;
  }

  return (
    <div>
      {/* Search moved to header in MainContent */}

      <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
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
