import { useState, useEffect } from "react";
import { useFriends } from "@/queries/friendQueries";
import { Search, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function UserList({ selectedUser, onSelectUser }) {
  const { data: friends, isLoading } = useFriends();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const LoadingSkeleton = () => (
    <div className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 rounded-md flex justify-between bg-sec">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-ter rounded-full animate-pulse"></div>
            <div className="h-5 bg-ter rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 bg-ter rounded w-20 animate-pulse"></div>
        </div>
      ))}
    </div>
  );
  
  const filteredUsers = friends?.filter((friend) => {
    const fullName = `${friend.FirstName || ""} ${friend.LastName || ""}`.toLowerCase();
    const username = friend.Username?.toLowerCase() || "";
    const email = friend.Email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      fullName.includes(search) ||
      username.includes(search) ||
      email.includes(search)
    );
  });

  const filteredModalUsers = friends?.filter((friend) => {
    const fullName = `${friend.FirstName || ""} ${friend.LastName || ""}`.toLowerCase();
    const username = friend.Username?.toLowerCase() || "";
    const email = friend.Email?.toLowerCase() || "";
    const search = modalSearchTerm.toLowerCase();

    return (
      fullName.includes(search) ||
      username.includes(search) ||
      email.includes(search)
    );
  });


  const handleStartChatClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
      }}
    >
      {/* Header */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/10 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold txt mb-2 sm:mb-4">
          Messages
        </h2>
        <Button
          onClick={handleStartChatClick}
          className="py-1.5 sm:py-2 px-2 sm:px-4 bg-[var(--btn)] hover:bg-[var(--btn-hover)] text-white rounded-full font-medium text-xs sm:text-sm"
        >
          Start Chat
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/10 -mt-2">
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

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredUsers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full txt-disabled">
            <Users className="w-8 h-8 sm:w-12 sm:h-12 mb-2" />
            <p className="text-xs sm:text-sm text-center px-2">No friends found.</p>
          </div>
        ) : (
          filteredUsers?.map((friend) => (
            <div
              key={friend._id}
              onClick={() => onSelectUser(friend)}
              className={`p-2 sm:p-3 lg:p-4 cursor-pointer transition-colors border-b border-gray-200/5 hover:opacity-80 ${selectedUser?._id === friend._id
                ? "border-l-4 border-l-[var(--btn)]"
                : ""
                }`}
              style={{
                backgroundColor:
                  selectedUser?._id === friend._id
                    ? "color-mix(in srgb, var(--bg-ter), black 15%)"
                    : "transparent",
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {friend.ProfilePicture ? (
                    <img
                      src={friend.ProfilePicture}
                      alt={friend.FirstName}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 txt-dim" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <h3 className="font-medium txt truncate text-xs sm:text-sm lg:text-base">
                      {friend.FirstName
                        ? `${friend.FirstName} ${friend.LastName || ""}`
                        : "old-user"}
                    </h3>
                    <span className="text-xs txt-disabled hidden sm:block">
                      {friend.Timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm txt-dim truncate flex-1">
                      {friend.LastMessage} {/* Add a last message if available */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Start New Chat */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="rounded-2xl overflow-hidden w-full max-w-lg"
            style={{
              backgroundColor: "color-mix(in srgb, var(--bg-sec), black 10%)",
            }}
          >
            {/* Modal Header */}
            <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/10 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold txt">
                Start a New Chat
              </h3>
              <Button variant="destructive" onClick={closeModal} className="text-sm">
                Cancel
              </Button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-2 sm:p-3 lg:p-4 border-b border-gray-200/10 -mt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 txt-dim" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200/20 rounded-full txt placeholder-txt-disabled focus:outline-none focus:border-[var(--btn)] transition-colors text-sm"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--bg-ter), black 8%)",
                  }}
                />
              </div>
            </div>

            {/* Modal Friends List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredModalUsers?.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 txt-disabled">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
                  <p className="text-xs sm:text-sm text-center px-2">No users found.</p>
                </div>
              ) : (
                filteredModalUsers.map((friend) => (
                  <div
                    key={friend._id}
                    onClick={() => {
                      onSelectUser(friend);
                      closeModal();
                    }}
                    className="p-2 sm:p-3 lg:p-4 cursor-pointer transition-colors border-b border-gray-200/5 hover:opacity-80"
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {friend.ProfilePicture ? (
                          <img
                            src={friend.ProfilePicture}
                            alt={friend.FirstName}
                            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-primary flex items-center justify-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 txt-dim" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                          <h3 className="font-medium txt truncate text-xs sm:text-sm lg:text-base">
                            {friend.FirstName
                              ? `${friend.FirstName} ${friend.LastName || ""}`
                              : "old-user"}
                          </h3>
                          <span className="text-xs txt-disabled hidden sm:block">
                            {friend.Username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
