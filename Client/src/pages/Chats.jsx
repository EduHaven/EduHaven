import UserList from "../components/chats/userlist";
import ChatWindow from "../components/chats/chatwindow";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useState } from "react";

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
            // users={dummyUsers}
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
