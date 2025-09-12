import { Button } from '@/components/ui/button';
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
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "secondary"}
            size="default"
            className="w-full text-left px-4 py-2"
          >
            {tab.label}
          </Button>

        ))}
      </div>
    </div>
  );
}

export default TabNavigation;
