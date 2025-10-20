import { useState, useMemo } from "react";
import PopupContainer from "@/components/ui/Popup";
import { User, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const FriendsPopup = ({
  showPopup,
  setShowPopup,
  friendsList,
  popupRef,
  user,
  kudosCount,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter friends based on search term
  const filteredFriends = useMemo(() => {
    if (!searchTerm.trim()) return friendsList;
    
    const searchLower = searchTerm.toLowerCase();
    return friendsList.filter((friend) => {
      const fullName = `${friend.FirstName || ""} ${friend.LastName || ""}`.toLowerCase();
      const username = (friend.Username || "").toLowerCase();
      return fullName.includes(searchLower) || username.includes(searchLower);
    });
  }, [friendsList, searchTerm]);

  // Reset search when popup closes
  const handleClosePopup = () => {
    setShowPopup(false);
    setSearchTerm("");
  };
  return (
    <div className="relative flex items-center mb-4 gap-4">
      <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
        <img
          src={
            user?.ProfilePicture ||
            `https://api.dicebear.com/9.x/initials/svg?seed=${user.FirstName}`
          }
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center flex-1">
        <span className="block text-2xl font-bold text-[var(--text-primary)]">
          {kudosCount}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">Kudos</span>
      </div>
      <div
        onClick={() => setShowPopup(!showPopup)}
        className="text-center flex-1 cursor-pointer hover:bg-white/20 rounded-lg p-2 transition-colors"
      >
        <span className="block text-2xl font-bold text-[var(--text-primary)]">
          {friendsList.length}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">Friends</span>
      </div>

      {showPopup && (
        <PopupContainer
          title="Friends List"
          onClose={handleClosePopup}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm txt-dim bg-sec px-3 py-1 rounded-full">
              {friendsList.length} friends
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 txt-dim transition-colors group-focus-within:text-[var(--btn)]" />
            </div>
            <input
              type="text"
              className="bg-ter border border-[var(--bg-sec)] txt text-sm rounded-xl focus:ring-2 focus:ring-[var(--btn)] focus:border-[var(--btn)] block w-full pl-11 pr-10 py-2.5 transition-all placeholder:txt-dim outline-none"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 txt-dim hover:text-[var(--btn)] transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[28rem]">
            {filteredFriends.length === 0 ? (
              <div className="txt-dim text-center mt-10 py-8">
                {searchTerm ? (
                  <div className="space-y-2">
                    <Search className="w-12 h-12 mx-auto opacity-30" />
                    <p className="text-base font-medium">No friends found</p>
                    <p className="text-sm opacity-75">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <User className="w-12 h-12 mx-auto opacity-30" />
                    <p>No friends yet</p>
                  </div>
                )}
              </div>
            ) : (
              filteredFriends.map((friend) => (
                <Link key={friend._id} to={`/user/${friend._id}`}>
                  <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-sec/70 transition rounded-lg mx-2">
                    <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                      {friend.ProfilePicture ? (
                        <img
                          src={friend.ProfilePicture}
                          className="w-full h-full object-cover"
                          alt={`${friend.FirstName}'s profile`}
                        />
                      ) : (
                        <div className="w-full h-full bg-sec flex items-center justify-center">
                          <User className="w-5 h-5 txt-dim" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="txt font-medium leading-tight text-lg truncate">
                        {friend.FirstName
                          ? `${friend.FirstName} ${friend.LastName || ""}`
                          : "old-user"}
                      </p>
                      {friend.Username && (
                        <span className="text-sm txt-dim">
                          @{friend.Username}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </PopupContainer>
      )}
    </div>
  );
};

export default FriendsPopup;