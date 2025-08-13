import { UserPlus } from "lucide-react";

function UserCard({
  user,
  selectedTab,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
}) {
  return (
    <div className="bg-[var(--bg-ter)] p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-[var(--btn)]"
        />
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-[var(--txt)]">{`${user.FirstName} ${user.LastName || ""}`}</h4>
          <p className="text-sm text-[var(--txt-sec)] mt-1 line-clamp-2">{user.Bio || "No bio available"}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {user.OtherDetails?.interests ? (
              user.OtherDetails.interests.split(',').map((interest, index) => (
                <span key={index} className="text-xs text-[var(--txt-sec)] bg-[var(--bg-sec)] px-3 py-1 rounded-full">
                  {interest.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs text-[var(--txt-sec)] bg-[var(--bg-sec)] px-3 py-1 rounded-full">
                No interests available
              </span>
            )}
          </div>
        </div>
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
