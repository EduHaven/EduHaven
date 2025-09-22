import NotificationIndicator from "../NotificationIndicator";

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "suggested", label: "Suggested" },
    { id: "friendRequests", label: "Friend Requests" },
    { id: "sentRequests", label: "Sent Requests" },
    { id: "allFriends", label: "All Friends" },
  ];

  return (
    <div className="w-60 overflow-hidden hidden sm:flex flex-col p-4 h-screen mr-3 2xl:mr-6 bg-[var(--bg-sec)]">
      <h3 className="text-xl font-semibold mb-4 text-[var(--txt)]">Friends</h3>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-[var(--btn)] text-white"
                : "hover:bg-[var(--bg-ter)] duration-300"
            }`}
          >
            {tab.label}
            {tab.id === "friendRequests" && <NotificationIndicator />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
