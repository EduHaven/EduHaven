import {
  useAcceptRequest,
  useCancelRequest,
  useRejectRequest,
  useRemoveFriend,
  useSendRequest,
} from "@/queries/friendQueries";
import { UserPlus } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

function UserCard({ user, selectedTab }) {
  const { mutate: sendRequest } = useSendRequest();
  const { mutate: cancelRequest } = useCancelRequest();
  const { mutate: rejectRequest } = useRejectRequest();
  const { mutate: acceptRequest } = useAcceptRequest();
  const { mutate: removeFriend } = useRemoveFriend();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-sec p-3 pt-4 rounded-3xl flex-1 basis-[250px] max-w-sm flex flex-col justify-between">
      <Link
        to={`/user/${user._id}`}
        className="flex flex-col items-center justify-center hover:brightness-90 transition"
      >
        <img
          src={
            user?.ProfilePicture ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${user.FirstName}`
          }
          alt="Profile"
          className="w-24 object-cover aspect-square rounded-full cursor-pointer"
        />
        <div className="flex flex-col items-center text-center justify-center px-2 my-2">
          <div className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {`${user.FirstName} ${user.LastName || ""}`}
          </div>
          <p className={`text-sm txt-dim ${isExpanded ? "" : "line-clamp-2"}`}>
            {user.Bio}
          </p>

          <div className="mt-2 mb-1">
            {user.OtherDetails?.interests && (
              <div className="flex flex-wrap gap-1.5 overflow-hidden whitespace-nowrap text-ellipsis">
                {user.OtherDetails.interests.split(",").map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-ter px-2 py-1 rounded-full inline-block"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>

      <div>
        {selectedTab === "suggested" && !user.requestSent && (
          <Button
            onClick={() => sendRequest(user._id)}
            variant="default"
            size="default"
            className="w-full text-sm txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </Button>

        )}

        {selectedTab === "suggested" && user.requestSent && (
          <Button
            onClick={() => cancelRequest(user._id)}
            variant="secondary"
            size="default"
            className="w-full text-sm txt"
          >
            Cancel Request
          </Button>
        )}

        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <Button
              onClick={() => rejectRequest(user._id)}
              variant="destructive"
              size="default"
              className="w-1/2 text-sm txt"
            >
              Reject
            </Button>
            <Button
              onClick={() => acceptRequest(user._id)}
              variant="default"
              size="default"
              className="w-1/2 text-sm txt"
            >
              Accept
            </Button>
          </div>
        )}

        {selectedTab === "sentRequests" && (
          <Button
            onClick={() => cancelRequest(user._id)}
            variant="cancel"
            size="default"
            className="w-full text-sm txt flex items-center justify-center gap-1"
          >
            Cancel Request
          </Button>
        )}

        {selectedTab === "allFriends" && (
          <Button
            onClick={() => removeFriend(user._id)}
            variant="destructive"
            size="default"
            className="w-full text-sm txt flex items-center justify-center gap-1"
          >
            Remove Friend
          </Button>
        )}
      </div>
    </div>
  );
}

// PropTypes validation to fix linting errors
UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    FirstName: PropTypes.string,
    LastName: PropTypes.string,
    ProfilePicture: PropTypes.string,
    Bio: PropTypes.string,
    requestSent: PropTypes.bool,
  }).isRequired,
  selectedTab: PropTypes.string.isRequired,
};

export default UserCard;
