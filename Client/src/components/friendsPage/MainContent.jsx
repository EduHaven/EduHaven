import { useState } from "react";
import SuggestedFriends from "./tabs/SuggestedFriends.jsx";
import FriendRequests from "./tabs/FriendRequests.jsx";
import SentRequests from "./tabs/SentRequests.jsx";
import AllFriends from "./tabs/AllFriends.jsx";
import SearchBar from "./SearchBar";

function MainContent({ selectedTab }) {
  const getTitle = () => {
    switch (selectedTab) {
      case "findFriends":
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

  const renderTab = (searchTerm) => {
    switch (selectedTab) {
      case "findFriends":
        return <SuggestedFriends searchTerm={searchTerm} />;
      case "friendRequests":
        return <FriendRequests searchTerm={searchTerm} />;
      case "sentRequests":
        return <SentRequests searchTerm={searchTerm} />;
      case "allFriends":
        return <AllFriends searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const getPlaceholder = () => {
    switch (selectedTab) {
      case "findFriends":
        return "Search by name, email, skills, or interests...";
      case "friendRequests":
        return "Search friend requests...";
      case "sentRequests":
        return "Search sent requests...";
      case "allFriends":
        return "Search friends...";
      default:
        return "Search...";
    }
  };

  return (
    <div
      id="scrollableDiv"
      className="pl-3 flex-1 pt-3 pr-3 2xl:pt-6 2xl:pr-6 pb-8 overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4 pb-1 space-x-4">
        <h2 className="text-2xl font-semibold text-[var(--txt)] pl-1">
          {getTitle()}
        </h2>
        <div className="ml-4 w-full max-w-2xl xl:max-w-xl lg:max-w-lg">
          <SearchBar onSearch={setSearchTerm} placeholder={getPlaceholder()} />
        </div>
      </div>
      <div className="space-y-4">{renderTab(searchTerm)}</div>
    </div>
  );
}

export default MainContent;
