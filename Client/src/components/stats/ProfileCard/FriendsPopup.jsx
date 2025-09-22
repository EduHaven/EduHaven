import { AnimatePresence, motion } from "framer-motion";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FriendsPopup = ({
  showPopup,
  setShowPopup,
  friendsList,
  popupRef,
  user,
  kudosCount,
}) => {
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
        ref={popupRef}
      >
        <span className="block text-2xl font-bold text-[var(--text-primary)]">
          {friendsList.length}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">Friends</span>
      </div>

      {/* Updated Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-4"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              ref={popupRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full max-w-80 sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
                       h-2/5 sm:h-96 md:h-[28rem] lg:h-[32rem] 
                       bg-sec rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-ter border-b border-gray-600/50 p-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold txt">Friends List</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm txt-dim bg-sec px-3 py-1 rounded-full">
                    {friendsList.length} friends
                  </span>
                  <Button
                    onClick={() => setShowPopup(false)}
                    variant="transparent"
                    className="txt hover:text-[var(--btn)] p-1"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Friends List */}
              <div className="flex-1 overflow-y-auto bg-sec-light pt-4">
                {friendsList.length === 0 ? (
                  <p className="txt-dim text-center mt-10">No friends yet</p>
                ) : (
                  friendsList.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-sec/70 transition rounded-lg mx-2"
                    >
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
                        <p className="txt font-medium text-lg truncate">
                          {friend.FirstName
                            ? `${friend.FirstName} ${friend.LastName || ""}`
                            : "old-user"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendsPopup;
