import SuggestedFriends from "./tabs/SuggestedFriends.jsx";
import FriendRequests from "./tabs/FriendRequests.jsx";
import SentRequests from "./tabs/SentRequests.jsx";
import AllFriends from "./tabs/AllFriends.jsx";

function MainContent({ selectedTab }) {
  const renderTab = () => {
    switch (selectedTab) {
      case "findFriends":
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
    <div
      id="scrollableDiv"
      className="pl-3 flex-1 pt-3 pr-3 2xl:pt-6 2xl:pr-6 pb-8 overflow-y-auto"
    >
      {renderTab()}
    </div>
  );
}

export default MainContent;
