import SuggestedFriends from "./tabs/SuggestedFriends.jsx";
import FriendRequests from "./tabs/FriendRequests.jsx";
import SentRequests from "./tabs/SentRequests.jsx";
import AllFriends from "./tabs/AllFriends.jsx";

function MainContent({ selectedTab }) {
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

  const renderTab = () => {
    switch (selectedTab) {
      case "suggested":
        return <SuggestedFriends />;
      case "friendRequests":
        return <FriendRequests />;
      case "sentRequests":
        return <SentRequests />;
      case "allFriends":
        return <AllFriends />;
      default:
        return null;
    }
  };

  return (
    <div className="ml-3 flex-1 pt-3 pr-3 2xl:pt-6 2xl:pr-6 pb-8 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-[var(--txt)]">
        {getTitle()}
      </h2>
      <div className="space-y-4">{renderTab()}</div>
    </div>
  );
}

export default MainContent;
