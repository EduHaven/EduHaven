import { useState, useRef, useEffect } from "react";
import { Send, MoreVertical, Smile, User, Users } from "lucide-react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

// Dummy messages for demonstration
const getDummyMessages = (userId) => {
  const messageTemplates = {
    1: [
      {
        id: 1,
        text: "Hey! How's the studying going?",
        sender: "other",
        timestamp: "10:30 AM",
      },
      {
        id: 2,
        text: "Pretty good! Working on calculus problems.",
        sender: "me",
        timestamp: "10:32 AM",
      },
      {
        id: 3,
        text: "Need any help? I'm pretty good with derivatives.",
        sender: "other",
        timestamp: "10:33 AM",
      },
      {
        id: 4,
        text: "That would be awesome! I'm struggling with the chain rule.",
        sender: "me",
        timestamp: "10:35 AM",
      },
      {
        id: 5,
        text: "No problem! Want to hop on a video call?",
        sender: "other",
        timestamp: "10:36 AM",
      },
    ],
    2: [
      {
        id: 1,
        text: "Thanks for the study notes!",
        sender: "other",
        timestamp: "2:15 PM",
      },
      {
        id: 2,
        text: "You're welcome! How did the exam go?",
        sender: "me",
        timestamp: "2:20 PM",
      },
      {
        id: 3,
        text: "Really well! Your notes were super helpful.",
        sender: "other",
        timestamp: "2:22 PM",
      },
    ],
    3: [
      {
        id: 1,
        text: "Hey, can we reschedule our study session?",
        sender: "other",
        timestamp: "Yesterday",
      },
      {
        id: 2,
        text: "Sure! What time works better for you?",
        sender: "me",
        timestamp: "Yesterday",
      },
    ],
    5: [
      {
        id: 1,
        text: "Don't forget about tomorrow's group study at 3 PM",
        sender: "other",
        timestamp: "Yesterday",
      },
      {
        id: 2,
        text: "What topics are we covering?",
        sender: "me",
        timestamp: "Yesterday",
      },
      {
        id: 3,
        text: "Data structures and algorithms",
        sender: "other",
        timestamp: "Yesterday",
      },
      {
        id: 4,
        text: "Perfect! I'll bring my notes on binary trees",
        sender: "me",
        timestamp: "Yesterday",
      },
    ],
  };

  return messageTemplates[userId] || [];
};

function ChatWindow({ selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  // the state variables for setting states of the emojipicker
  const [showEmoji, setShowEmoji] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const textareaRef = useRef(null);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      setMessages(getDummyMessages(selectedUser.id));
    }
  }, [selectedUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setCursorPosition(0);

    // This hook is to close the emojipicker when clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target) &&
          emojiButtonRef.current &&
          !emojiButtonRef.current.contains(event.target)
        ) {
          setShowEmoji(false);
        }
      };

      if (showEmoji) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showEmoji]);

    // TODO: Connect to backend - Send message via socket/API
    // Example: socket.emit('sendMessage', { userId: selectedUser.id, message: message });

    // Simulate typing indicator and response (remove this in real implementation)
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoReply = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll get back to you soon.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // To make sure to track the emojipicker state
  const toggleEmojiPicker = () => {
    setShowEmoji(!showEmoji);
  };

  // To insert emoji into our message
  const onEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const position = textarea.selectionStart || cursorPosition;

      const newMessage =
        message.slice(0, position) + emoji.native + message.slice(position);

      setMessage(newMessage);
      setShowEmoji(false);

      textarea.focus();
      const newCursorPosition = position + emoji.native.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      setCursorPosition(newCursorPosition);
    }
  };

  const handleTextareaClick = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleTextareaKeyUp = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Empty state when no user is selected
  if (!selectedUser) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-ter), black 15%)",
        }}
      >
        <div className="text-center txt-disabled">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
          <p>Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-ter), black 15%)",
      }}
    >
      {/* Chat Header - Responsive */}
      <div
        className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/20"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Avatar - Responsive sizing */}
            {selectedUser.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center">
                {selectedUser.isGroup ? (
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 txt-dim" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5 txt-dim" />
                )}
              </div>
            )}

            {/* User Info - Responsive text sizing */}
            <div>
              <h3 className="font-semibold txt text-sm sm:text-base">
                {selectedUser.name}
              </h3>
              <p className="text-xs sm:text-sm txt-dim">
                {selectedUser.isGroup
                  ? `${Math.floor(Math.random() * 20) + 5} members`
                  : selectedUser.isOnline
                    ? "Online"
                    : "Last seen recently"}
              </p>
            </div>
          </div>

          {/* Action Buttons - Responsive sizing */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-1.5 sm:p-2 rounded-full hover:opacity-70 transition-colors txt-dim hover:txt">
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* TODO: Connect to backend - Add video/voice call functionality */}
          </div>
        </div>
      </div>

      {/* Messages Area - Responsive */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center txt-disabled mt-6 sm:mt-8">
            <p className="text-sm sm:text-base">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-2xl ${
                  msg.sender === "me"
                    ? "bg-[var(--btn)] text-white rounded-br-md"
                    : "rounded-bl-md txt"
                }`}
                style={{
                  backgroundColor:
                    msg.sender === "me"
                      ? "var(--btn)"
                      : "color-mix(in srgb, var(--bg-sec), black 10%)",
                }}
              >
                <p className="break-words text-xs sm:text-sm lg:text-base">
                  {msg.text}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "me" ? "text-white/70" : "txt-disabled"
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator - Responsive */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="txt px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-2xl rounded-bl-md"
              style={{
                backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
              }}
            >
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-txt-dim rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-txt-dim rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-txt-dim rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Responsive */}
      <div
        className="p-2 sm:p-3 lg:p-4 border-t border-gray-200/20 relative"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
        }}
      >
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Emoji Button */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              onClick={toggleEmojiPicker}
              className="p-2 rounded-full hover:opacity-70 transition-colors txt-dim hover:txt"
            >
              <Smile className="w-7 h-7" />
            </button>

            {/* Emoji Picker Popup */}
            {showEmoji && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-full left-0 mb-2 z-50"
                style={{ zIndex: 9999 }}
              >
                <EmojiPicker
                  data={data}
                  onEmojiSelect={onEmojiSelect}
                  theme="auto"
                  previewPosition="none"
                  skinTonePosition="none"
                />
              </div>
            )}
          </div>
          {/* Message Input */}
          <div
            className="flex-1 rounded-2xl border border-gray-200/20 focus-within:border-[var(--btn)] transition-colors"
            style={{
              backgroundColor: "color-mix(in srgb, var(--bg-ter), black 12%)",
            }}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setCursorPosition(e.target.selectionStart);
              }}
              onClick={handleTextareaClick}
              onKeyUp={handleTextareaKeyUp}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 sm:p-3 bg-transparent resize-none txt placeholder-txt-disabled focus:outline-none text-sm sm:text-base"
              rows={1}
              style={{ maxHeight: "120px" }}
            />
          </div>

          {/* Send Button - Responsive */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              message.trim()
                ? "bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* TODO: Connect to backend - Add the following features:
         * 1. Real-time messaging via WebSocket
         */}
      </div>
    </div>
  );
}

export default ChatWindow;
