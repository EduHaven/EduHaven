import { useEffect, useRef, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import ProfileIcon from "./ProfileIcon.jsx";
import { Button } from "@/components/ui/button";

function ChatPannel({
  messages,
  typingUsers,
  sendMessage,
  startTyping,
  stopTyping,
  setShowChat,
}) {
  const [message, setMessage] = useState("");
  const messageInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing
  const handleTyping = () => {
    startTyping();

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-[363px] m-4 mb-0 rounded-3xl bg-sec flex flex-col overflow-auto h-[calc(100vh-90px)] p-5 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium txt ">Chat</h2>
        <Button
          onClick={() => setShowChat(false)}
          variant="transparent"
          size="icon"
          className="txt hover:txt-hover"
        >
          <X size={22} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            {msg.messageType === "system" ? (
              <div className="text-center text-sm txt-dim italic">
                {msg.message}
              </div>
            ) : (
              <div className="space-y-1 flex items-center gap-2.5">
                <ProfileIcon profileImage={msg.profileImage} size={7} />
                <div className="-space-y-0.5 w-full">
                  <div className="flex items-center gap-2 justify-between ">
                    <span className="font-semibold text-sm txt opacity-90">
                      {msg.username}
                    </span>
                    <span className="text-xs txt-dim">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="txt break-words ">{msg.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm txt-dim italic">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleMessageSubmit}
        className="p-1 border border-gray-500/40 rounded-full "
      >
        <div className="flex gap-2">
          <input
            ref={messageInputRef}
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-transparent rounded-lg txt border-none outline-none focus:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            variant="transparent"
            disabled={!message.trim()}
            className="txt rounded-lg"
          >
            <SendHorizontal size={20} />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatPannel;
