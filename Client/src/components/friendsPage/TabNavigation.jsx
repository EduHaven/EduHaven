import { Button } from "@/components/ui/button";
import NotificationIndicator from "../NotificationIndicator";
import { Users, UserPlus, UserCheck, User } from "lucide-react";

const tabIcons = {
  suggested: <UserPlus size={24} />,
  friendRequests: <Users size={24} />,
  sentRequests: <UserCheck size={24} />,
  allFriends: <User size={24} />,
};

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: "suggested", label: "Suggested" },
    { id: "friendRequests", label: "Friend Requests" },
    { id: "sentRequests", label: "Sent Requests" },
    { id: "allFriends", label: "All Friends" },
  ];

  return (
    <aside className="w-60 xl:w-72 h-screen bg-sec shadow-md relative hidden sm:flex flex-col">
      <h1 className="px-8 py-4 mt-6 text-xl font-bold pb-0">Friends</h1>
      <nav className="p-2 xl:p-4 space-y-0">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`group flex items-center justify-between p-3 rounded-lg text-md w-full text-nowrap transition relative ${
              activeTab === tab.id
                ? "bg-[var(--btn)] text-white"
                : "hover:bg-ter"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tabIcons[tab.id]} {tab.label}
              {tab.id === "friendRequests" && <NotificationIndicator />}
            </span>
          </Button>
        ))}
      </nav>
    </aside>
  );
}

export default TabNavigation;
