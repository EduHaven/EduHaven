import UserList from "../components/chats/userlist";
import ChatWindow from "../components/chats/chatwindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";

// Dummy data for demonstration
const dummyUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/public/userProfile.webp",
    lastMessage: "Hey, are you ready for the study session?",
    timestamp: "2 min ago",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: null,
    lastMessage: "Thanks for helping with the math problem!",
    timestamp: "15 min ago",
    isOnline: true,
    unreadCount: 0,
  },
  {
    id: 3,
    name: "Mike Wilson",
    avatar: "/public/userProfile.webp",
    lastMessage: "Can we reschedule our meeting?",
    timestamp: "1 hour ago",
    isOnline: false,
    unreadCount: 1,
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: null,
    lastMessage: "Great job on the presentation today!",
    timestamp: "3 hours ago",
    isOnline: false,
    unreadCount: 0,
  },
];

function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-primary), black 15%)",
      }}
    >
      <PanelGroup autoSaveId="chat-panel" direction="horizontal">
        {/* Sidebar */}
        <Panel minSize={15} defaultSize={25} maxSize={40}>
          <UserList
            users={dummyUsers}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </Panel>

        {/* Draggable Resizer */}
        <PanelResizeHandle className="w-1 bg-gray-600 hover:bg-gray-400 cursor-col-resize transition-colors" />

        {/* Chat Window */}
        <Panel minSize={40}>
          <ChatWindow selectedUser={selectedUser} />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Chats;
