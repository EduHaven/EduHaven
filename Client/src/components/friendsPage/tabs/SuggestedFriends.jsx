import { useAllSuggestedUsers } from "@/queries/friendQueries";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import UserCard from "../UserCard";
import { Loader2Icon } from "lucide-react";
import FriendsSkeletonLoader from "@/components/skeletons/FriendsSkeletonLoader";

export default function FindPeople({ searchTerm: externalSearchTerm = "" }) {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm);

  useEffect(() => {
    setSearchTerm(externalSearchTerm);
  }, [externalSearchTerm]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAllSuggestedUsers(searchTerm);

  const users = data?.pages.flatMap((page) => page.users) || [];

  // searchTerm is controlled by parent MainContent via prop

  return (
    <div>
      {/* Search moved to header in MainContent */}

      {isLoading && <FriendsSkeletonLoader />}

      {!isLoading && !isFetchingNextPage && users.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No matching people found
        </div>
      )}

      <InfiniteScroll
        dataLength={users.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="mx-auto w-fit bg-transparent">
            <Loader2Icon
              size={50}
              className="mt-5 animate-spin text-[var(--bg-sec)]"
            />
          </div>
        }
        scrollThreshold={0.8}
        scrollableTarget="scrollableDiv"
        style={{ overflow: "visible" }}
      >
        <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
          {users.map((user) => (
            <UserCard key={user._id} user={user} selectedTab="findFriends" />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
