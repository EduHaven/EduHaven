import UserCard from "./UserCard"

function MainContent({
  selectedTab,
  loading,
  users,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest,
  onRejectRequest,
  onRemoveFriend,
}) {
  const getTitle = () => {
    switch (selectedTab) {
      case "suggested":
        return "Suggested Friends";
      case "friendRequests":
        return "Friend Requests";
      case "sentRequests":
        return "Sent Requests";
      case "allFriends":
        return "All Friends";
      default:
        return "";
    }
  };

  const renderUsers = () =>
    users.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          selectedTab={selectedTab}
          onSendRequest={onSendRequest}
          onCancelRequest={onCancelRequest}
          onAcceptRequest={onAcceptRequest}
          onRejectRequest={onRejectRequest}
          onRemoveFriend={onRemoveFriend}
        />
      ))}
      </div>
    ) : (
      <div className="text-center text-gray-500">Nothing to display</div>
    );

  return (
    <div className="w-full bg-[var(--bg-sec)] p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-[var(--txt)]">{getTitle()}</h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          renderUsers()
        )}
      </div>
    </div>
  );
}

export default MainContent;
