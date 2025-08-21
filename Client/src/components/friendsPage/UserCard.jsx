import { UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserCard({
  user,
  selectedTab,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
}) {
  const navigate = useNavigate();

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="bg-[var(--bg-ter)] p-4 rounded-xl shadow-md">
      {/* {console.log(user)} */}
      <div className="flex items-center">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="w-14 h-14 rounded-full"
        />
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-semibold">{`${user.FirstName} ${user.LastName || ""}`}</h4>
          <p className="text-sm text-gray-500">{user.Bio}</p>

          <div className="mt-2">
            {user.OtherDetails?.interests ? (
              <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded-full inline-block">
                {user.OtherDetails.interests  }
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full inline-block">
                No interests available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Button - Always visible */}
      <div className="mt-3 mb-2">
        <button
          onClick={() => handleViewProfile(user._id)}
          className="w-full bg-[var(--bg-sec)] text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--bg-ter)] txt border border-[var(--border-color)]"
        >
          <User className="w-4 h-4" />
          View Profile
        </button>
      </div>

      <div className="mt-3">
        {selectedTab === "suggested" && !user.requestSent && (
          <button
            onClick={() => onSendRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition text-white hover:bg-[var(--btn-hover)] txt"
          >
            <UserPlus className="w-5 h-5" />
            Add Friend
          </button>
        )}

        {selectedTab === "friendRequests" && (
          <div className="flex gap-2">
            <button
              onClick={() => onAcceptRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-white text-sm px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Accept
            </button>
            <button
              onClick={() => onRejectRequest(user._id)}
              className="w-1/2 bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg transition hover:bg-[var(--btn-hover)] txt"
            >
              Reject
            </button>
          </div>
        )}

        {selectedTab === "sentRequests" && (
          <button
            onClick={() => onCancelRequest(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Cancel Request
          </button>
        )}

        {selectedTab === "allFriends" && (
          <button
            onClick={() => onRemoveFriend(user._id)}
            className="w-full bg-[var(--btn)] text-sm text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
          >
            Remove Friend
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
