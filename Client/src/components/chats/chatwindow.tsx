
import React, { useState, useRef, useEffect } from "react";
import { Send, MoreVertical, Smile, User, Users } from "lucide-react";
import UseSocketContext from '../../contexts/SocketContext';

function Message({ message, isMe }) {
  const messageStyle = isMe
    ? {
        backgroundColor: "var(--btn)",
        color: "white",
        borderRadius: "20px 20px 4px 20px",
      }
    : {
        backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
        color: "var(--txt)",
        borderRadius: "20px 20px 20px 4px",
      };

  const textStyle = isMe ? "text-white" : "txt";
  const timestampStyle = isMe ? "text-white/70" : "txt-disabled";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[70%] px-3 py-2 rounded-2xl"
        style={messageStyle}
      >
        <p className={`break-words text-sm sm:text-base ${textStyle}`}>
          {message.message}
        </p>
        <p className={`text-xs mt-1 ${timestampStyle}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

export default function ChatWindow({ selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Use the context hook to get the socket and user
  const { socket, user } = UseSocketContext();
  
  // Get the user ID from the user object provided by the context
  const myUserId = user ? user.id : null;
  const roomId = selectedUser ? [myUserId, selectedUser.id].sort().join("_") : null;

  useEffect(() => {
    if (!selectedUser || !socket) {
      setMessages([]);
      return;
    }

    socket.emit("join_room", roomId);
    socket.emit("get_messages", { roomId, limit: 50, offset: 0 });

    socket.on("messages_history", (data) => {
      if (data.roomId === roomId) {
        setMessages(data.messages);
      }
    });

    socket.on("new_message", (newMessage) => {
      if (newMessage.roomId === roomId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("user_typing", (data) => {
      if (data.isTyping && data.userId !== myUserId && data.roomId === roomId) {
        console.log(`${data.username} is typing...`);
      }
    });

    return () => {
      socket.off("messages_history");
      socket.off("new_message");
      socket.off("user_typing");
      socket.emit("leave_room", roomId);
    };
  }, [selectedUser, roomId, socket, myUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !socket) return;
    socket.emit("send_message", {
      roomId: roomId,
      message: message,
      userId: myUserId
    });
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    // You would emit a "typing_start" event here
    // And a "typing_stop" event after a timeout
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center txt-disabled">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
          <p>Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[color-mix(in_srgb,_var(--bg-ter),_black_15%)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/20 bg-[color-mix(in_srgb,_var(--bg-sec),_black_10%)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedUser.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                {selectedUser.isGroup ? <Users className="w-5 h-5 txt-dim" /> : <User className="w-5 h-5 txt-dim" />}
              </div>
            )}
            <div>
              <h3 className="font-semibold txt text-base">{selectedUser.name}</h3>
              <p className="text-sm txt-dim">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:opacity-70 transition-colors txt-dim hover:txt">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center txt-disabled mt-8">
            <p className="text-base">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg}
              isMe={msg.userId === myUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200/20 bg-[color-mix(in_srgb,_var(--bg-sec),_black_10%)]">
        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-2xl border border-gray-200/20 focus-within:border-[var(--btn)] transition-colors bg-[color-mix(in_srgb,_var(--bg-ter),_black_12%)]">
            <textarea
              value={message}
              onChange={handleTyping}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 bg-transparent resize-none txt placeholder-txt-disabled focus:outline-none text-base"
              rows={1}
              style={{ maxHeight: "120px" }}
            />
          </div>
          <button className="p-2 rounded-full hover:opacity-70 transition-colors txt-dim hover:txt">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full transition-colors ${
              message.trim()
                ? "bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}