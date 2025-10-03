import { useAllSuggestedUsers } from "@/queries/friendQueries";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBar from "../SearchBar";
import UserCard from "../UserCard";
import FriendsSkeletonLoader from "@/components/skeletons/FriendsSkeletonLoader";

export default function FindPeople() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAllSuggestedUsers(searchTerm);

  const users = data?.pages.flatMap((page) => page.users) || [];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by name, email, skills, or interests..."
      />

      <div
        id="scrollableDiv2"
        style={{ height: "calc(100vh - 92px)", overflow: "auto" }}
      >
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
            <p className="text-center txt-dim">
              <b>Loading...</b>
            </p>
          }
          scrollThreshold={0.8}
          scrollableTarget="scrollableDiv2"
        >
          <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
            {users.map((user) => (
              <UserCard key={user._id} user={user} selectedTab="findFriends" />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
