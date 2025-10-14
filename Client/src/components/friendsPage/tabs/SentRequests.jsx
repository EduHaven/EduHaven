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
    return <FriendsSkeletonLoader />;
  }

  const hasSentRequests = sentRequests.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[var(--txt)]">
          Sent Requests
        </h2>
        {hasSentRequests && (
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search sent requests..."
            className="mb-0 sm:max-w-sm lg:max-w-md"
          />
        )}
      </div>

      {!hasSentRequests && (
        <div className="text-center text-gray-500">No sent requests</div>
      )}

      {hasSentRequests && (
        <>
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
        </>
      )}
    </div>
  );
}
