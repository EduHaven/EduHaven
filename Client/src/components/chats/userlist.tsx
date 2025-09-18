import { useState } from "react";
import { Search, User, Users } from "lucide-react";

function UserList({ users, selectedUser, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
      }}
    >
      {/* Header - Responsive */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/10">
        <h2 className="text-lg sm:text-xl font-semibold txt mb-2 sm:mb-4">
          Messages
        </h2>

        {/* Search Bar - Responsive */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 txt-dim" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200/20 rounded-full txt placeholder-txt-disabled focus:outline-none focus:border-[var(--btn)] transition-colors text-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--bg-ter), black 8%)",
            }}
          />
        </div>
      </div>

      {/* User List - Responsive */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full txt-disabled">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
            <p className="text-xs sm:text-sm text-center px-2">
              No conversations
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`p-2 sm:p-3 lg:p-4 cursor-pointer transition-colors border-b border-gray-200/5 hover:opacity-80 ${
                selectedUser?.id === user.id
                  ? "border-l-4 border-l-[var(--btn)]"
                  : ""
              }`}
              style={{
                backgroundColor:
                  selectedUser?.id === user.id
                    ? "color-mix(in srgb, var(--bg-ter), black 15%)"
                    : "transparent",
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Avatar - Responsive sizing */}
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 txt-dim" />
                    </div>
                  )}

                  {/* Online Status Indicator - Responsive */}
                  {user.isOnline != undefined && (
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full border-2 border-sec ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  )}
                </div>

                {/* User Info - Responsive text sizing */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <h3 className="font-medium txt truncate text-xs sm:text-sm lg:text-base">
                      {user.name}
                    </h3>
                    <span className="text-xs txt-disabled hidden sm:block">
                      {user.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm txt-dim truncate flex-1">
                      {user.lastMessage}
                    </p>

                    {/* Unread Count Badge - Responsive sizing */}
                    {user.unreadCount > 0 && (
                      <div className="ml-1 sm:ml-2 bg-[var(--btn)] text-white text-xs rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[16px] sm:min-w-[20px] text-center">
                        {user.unreadCount > 9 ? "9+" : user.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer - Add New Chat Button - Responsive */}
      <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200/10">
        <button className="w-full py-1.5 sm:py-2 px-2 sm:px-4 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-full font-medium transition-colors text-xs sm:text-sm">
          Start Chat
        </button>
        {/* TODO: Connect to backend - Add functionality to start new conversations */}
      </div>
    </div>
  );
}

export default UserList;
