import { Send, User, UserPlus2, Users } from "lucide-react";

function TabNavigation({ selectedTab, onTabClick }) {
  const tabs = [
    { id: "suggested", label: "Suggested", icon: <User /> },
    { id: "friendRequests", label: "Friend Requests", icon: <UserPlus2 /> },
    { id: "sentRequests", label: "Sent Requests", icon: <Send /> },
    { id: "allFriends", label: "All Friends", icon: <Users/> },
  ];

  return (
    <div className="w-1/4 p-4 rounded-xl mr-6 bg-[var(--bg-sec)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--txt)]">Friends</h3>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`w-full text-left px-4 py-2 flex items-center gap-1.5 rounded-lg ${selectedTab === tab.id
              ? "bg-[var(--btn)] text-white"
              : "hover:bg-[var(--bg-ter)]"
              }`}
          >
            {tab.icon && <span className="inline-block mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
