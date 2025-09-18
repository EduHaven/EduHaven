import { MoreVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

import { useSendRequest, useUsersInfinite } from "@/queries/friendQueries";

function SuggestedFriends({ onViewSentRequests }) {
  const { mutate: sendFriendRequest } = useSendRequest();
  const { data, fetchNextPage, hasNextPage, isLoading } = useUsersInfinite(15);
  const suggestedFriends = data?.pages.flatMap((page) => page.users) || [];

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdrownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdrownRef.current &&
        !dropdrownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-gray-700/30 p-4 rounded-3xl shadow flex flex-col justify-center animate-pulse">
        <div className="w-full mb-4 h-8 bg-gray-500/20 rounded-md"></div>
        {Array(5)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center space-x-2 my-2"
            >
              <div className="w-10 aspect-square bg-gray-500/20 rounded-full"></div>
              <div className="flex-1 flex flex-col justify-center *:items-start space-y-2">
                <div className=" bg-gray-500/20 w-full h-4 rounded-md"></div>
                <div className=" bg-gray-500/20 w-8/12 h-2 rounded-md"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <section className="bg-sec rounded-3xl p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold txt">Suggested Friends</h3>
        <div className="relative" ref={dropdrownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <MoreVertical className="w-5 h-5 txt" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-ter rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onViewSentRequests();
                }}
                className="block w-full text-left px-4 py-2 text-sm txt hover:bg-sec"
                style={{ borderColor: "var(--txt-dim)" }}
              >
                Show Sent Requests
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 Infinite Scroll Wrapper */}
      <div id="scrollableDiv" style={{ height: "500px", overflow: "auto" }}>
        <InfiniteScroll
          dataLength={suggestedFriends.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<p className="text-center txt-dim">Loading...</p>}
          endMessage={
            <p className="text-center txt-dim">
              <b>No more suggestions</b>
            </p>
          }
          scrollThreshold={0.8}
          scrollableTarget="scrollableDiv"
        >
          <div className="space-y-2">
            {suggestedFriends.map((user) => (
              <div key={user._id} className="relative group py-1">
                <div className="flex items-center">
                  <Link
                    to={`/user/${user._id}`}
                    className="flex items-center hover:brightness-110"
                  >
                    <img
                      src={
                        user?.ProfilePicture ||
                        `https://api.dicebear.com/9.x/initials/svg?seed=${user.FirstName}`
                      }
                      className="size-12 rounded-full transition cursor-pointer"
                      alt={"Profile"}
                    />
                    <div className="ml-4 flex-1 overflow-hidden">
                      <div className="text-lg font-medium line-clamp-1 txt">
                        {user.FirstName
                          ? `${user.FirstName} ${user.LastName || ""}`
                          : "old-user"}
                      </div>
                      <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
                    </div>
                  </Link>
                </div>
                <div className="absolute top-[8%] right-0 bg-sec p-1.5 px-2 transition-all opacity-0 group-hover:opacity-100 flex gap-1">
                  {user.requestSent ? (
                    <button
                      disabled
                      className="border border-gray-500/50 text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition bg-sec txt"
                    >
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user._id)}
                      className="bg-ter text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
                    >
                      <Plus className="w-4 h-4" />
                      Friend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </section>
  );
}

export default SuggestedFriends;
