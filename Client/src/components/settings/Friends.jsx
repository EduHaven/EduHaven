import { useState, useMemo } from "react";
import { useFriends, useRemoveFriend } from "@/queries/friendQueries";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmRemoveFriendModal from "../ConfirmRemoveFriendModal";
import { Button } from "@/components/ui/button";

const Friends = ({ skeletonCount = 12 }) => {
  const { data: friends = [], isLoading } = useFriends({ staleTime: 0, cacheTime: 0 });
  const { mutate: removeFriend } = useRemoveFriend();
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleRemoveClick = (friend) => setSelectedFriend(friend);

  const confirmRemove = () => {
    if (selectedFriend) {
      removeFriend(selectedFriend._id);
      setSelectedFriend(null);
    }
  };

  const cancelRemove = () => setSelectedFriend(null);

  // Generate random widths for skeleton names
  const skeletonWidths = useMemo(() => {
    return [...Array(skeletonCount)].map(() => 180 + Math.floor(Math.random() * 100)); // 180px - 280px
  }, [skeletonCount]);

  const LoadingSkeleton = ({ count = skeletonCount }) => (
    <div className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-md flex justify-between bg-sec animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-ter rounded-full"></div>
            <div
              className="h-5 bg-ter rounded"
              style={{ width: `${skeletonWidths[index]}px` }}
            ></div>
          </div>
          <div className="h-8 bg-ter rounded w-20"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold txt">Friends List</h1>
        <Link to={"/session"} className="hover:underline txt">
          Find friends
        </Link>
      </div>

      {/* Skeleton loader always visible */}
      <LoadingSkeleton />

      {/* Actual friend list rendered on top */}
      {!isLoading && friends.length > 0 && (
        <ul className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden relative -mt-[calc(1.5rem*12)]">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="p-4 rounded-md flex justify-between bg-sec transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <Link
                  to={`/user/${friend._id}`}
                  className="flex items-center gap-4 hover:underline"
                >
                  {friend.ProfilePicture ? (
                    <img
                      src={friend.ProfilePicture}
                      className="w-9 h-9 rounded-full"
                      alt="profile"
                    />
                  ) : (
                    <div className="p-2 bg-ter rounded-full">
                      <User className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium line-clamp-1 txt">
                      {friend.FirstName
                        ? `${friend.FirstName} ${friend.LastName || ""}`
                        : "old-user"}
                    </h4>
                    {friend.Username && (
                      <p className="text-sm txt">{friend.Username}</p>
                    )}
                  </div>
                </Link>
              </div>
              <Button
                onClick={() => handleRemoveClick(friend)}
                disabled={friend.isRemoved}
                variant={friend.isRemoved ? "transparent" : "secondary"}
                className={`txt px-3 py-1 rounded ${
                  friend.isRemoved ? "bg-ter" : "hover:bg-red-500"
                }`}
              >
                {friend.isRemoved ? "Friend Removed" : "Remove"}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {selectedFriend && (
        <ConfirmRemoveFriendModal
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
    </div>
  );
};

export default Friends;
