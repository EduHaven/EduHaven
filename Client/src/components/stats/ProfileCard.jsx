import axiosInstance from "@/utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import {
  DraftingCompass,
  Earth,
  Edit3,
  Landmark,
  MessageCircle,
  Puzzle,
  Share2,
  ThumbsUp,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileCard = ({ isCurrentUser = false }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriendRequestLoading, setIsFriendRequestLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const { userId } = useParams();
  const [showLink, setShowLink] = useState(false);
  const [kudosCount, setKudosCount] = useState(0);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);

  // could be only "Add Friend", "Accept Request", "Cancel Request" or "Friends"
  const [friendRequestStatus, setFriendRequestStatus] = useState("Add Friends");

  // user part for share functionality
  const profilelink = user?._id
    ? `${window.location.origin}/user/${user._id}`
    : "";

  //Logic part for share functionality
  const togglelink = () => setShowLink((prev) => !prev);

  const copylink = () => {
    if (!profilelink) return;
    navigator.clipboard
      .writeText(profilelink)
      .then(() => {
        toast.success("Copied ");
        setShowLink(false);
      })
      .catch(() => toast.error("Not Copied "));
  };

  const handleFriendRequestAction = async () => {
    if (isFriendRequestLoading) return;

    setIsFriendRequestLoading(true);
    if (friendRequestStatus === "Add Friend") {
      await sendRequest(userId);
      setIsFriendRequestLoading(false);
    } else if (friendRequestStatus === "Cancel Request") {
      await cancelRequest(userId);
      setIsFriendRequestLoading(false);
    } else if (friendRequestStatus === "Accept Request") {
      await acceptRequest(userId);
      setIsFriendRequestLoading(false);
    }
  };

  const sendRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/request/${friendId}`, null);
      setFriendRequestStatus("Cancel Request");
      toast.success("Friend request sent!");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error sending friend request!"
      );
    }
  };

  const cancelRequest = async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/sent-requests/${friendId}`);
      setFriendRequestStatus("Add Friend");
      toast.info("Friend request canceled.");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error canceling friend request!"
      );
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axiosInstance.post(`/friends/accept/${friendId}`, null);
      setFriendRequestStatus("Friends");
      toast.success("Friend request accepted!");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error accepting friend request!"
      );
    }
  };

  const shareRef = useRef(null);

  useEffect(() => {
    if (showLink) {
      const handleClickOutside = (event) => {
        if (shareRef.current && !shareRef.current.contains(event.target)) {
          setShowLink(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showLink]);

  const popupRef = useRef(null);

  useEffect(() => {
    // Fetch friends list + count for either current user or the profile user
    const fetchFriendsForUser = async () => {
      try {
        if (isCurrentUser) {
          // Current (logged-in) user — keep using protected endpoints
          try {
            const listRes = await axiosInstance.get("/friends");

            const friends = listRes.data || [];
            setFriendsList(friends);
          } catch (err) {
            console.error("Error fetching current user's friends:", err);
            setFriendsList([]);
          }

          return;
        }

        try {
          const listRes = await axiosInstance.get(`/friends/${userId}/stats`);
          setFriendsList(listRes.data.stats.friends || []);

          // console.log(listRes.data);
        } catch (err) {
          toast.error("Error fetching profile user's friends");
          setFriendsList([]);
          console.error(err);
        }
      } catch (error) {
        console.error("Error fetching friends for profile:", error);
        setFriendsList([]);
      }
    };

    // only fetch when we have userId or we are current user
    if (isCurrentUser || userId) {
      fetchFriendsForUser();
    }
  }, [isCurrentUser, userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        let token = localStorage.getItem("token");
        if (isCurrentUser) {
          const decoded = jwtDecode(token);
          response = await axiosInstance.get(`/user/details?id=${decoded.id}`);
        } else {
          response = await axiosInstance.get(`/user/details?id=${userId}`);
        }

        // console.log(response);

        setUser(response.data);
        setKudosCount(response.data.kudosReceived || 0);
        setHasGivenKudos(response.data.hasGivenKudos || false);
        setFriendRequestStatus(response.data.relationshipStatus);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, [isCurrentUser, userId]);

  useEffect(() => {
    if (showPopup) {
      const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
          setShowPopup(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showPopup]);

  if (isLoading || !user) {
    return (
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/50 to-purple-500/5 shadow-2xl pt-6 w-full h-fit relative">
        {/* Skeleton nav */}
        <div className="flex justify-end gap-6 px-4">
          {isCurrentUser && (
            <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
          )}
          <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>
        </div>

        <div className="mx-4">
          {/* Skeleton profile */}
          <div className="relative flex items-center mb-4 gap-4 ">
            <div className="shrink-0 w-28 h-28 rounded-full bg-gray-400/30"></div>{" "}
            <div className="text-center flex-1">
              <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1 "></div>
              <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
            </div>
            <div className="text-center flex-1">
              <div className="h-8 w-14 mx-auto rounded-md bg-gray-400/30 mb-1"></div>
              <div className="h-4 w-18 mx-auto rounded-sm bg-gray-400/20"></div>
            </div>
          </div>

          {/* Skeleton user info */}
          <div className="mb-4">
            <div className="h-6 w-40 rounded-md bg-gray-400/30 mb-2"></div>
            <div className="h-4 w-64 rounded-sm bg-gray-400/20"></div>
          </div>

          {/* Skeleton buttons */}
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
            <div className="h-10 rounded-lg bg-gray-400/30 flex-1"></div>
            <div className="h-10 rounded-lg bg-gray-400/30 w-full"></div>
          </div>
        </div>

        {/* Skeleton details */}
        <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-7 w-7 rounded-full bg-gray-400/30"></div>
              <div className="flex-1">
                <div className="h-3 w-16 rounded-sm bg-gray-400/20 mb-1"></div>
                <div className="h-5 w-32 rounded-md bg-gray-400/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleGiveKudos = async () => {
    if (isCurrentUser) {
      toast.error("Kudos can't be given to yourself!");
      return;
    }

    if (hasGivenKudos) {
      toast.info("You already gave kudos to this user!");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/kudos", {
        receiverId: user._id,
      });

      toast.success("🎉 Kudos given successfully!");
      setKudosCount((prev) => prev + 1);
      setHasGivenKudos(true);
    } catch (error) {
      console.error(error); // incase anything fails
      toast.error(error.response?.data?.message || "Failed to give kudos.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative overflow-hidden">
      {/* nav */}
      <div className="flex justify-end gap-6 px-4">
        {isCurrentUser && (
          <Link to={"/settings/"}>
            <Edit3 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </Link>
        )}

        {user?._id && (
          <div className="relative inline-block">
            <Share2
              className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              onClick={togglelink}
            />

            {showLink && (
              <div
                ref={shareRef}
                className="absolute top-full mt-2 right-0 flex items-center bg-[#1f2937] rounded-lg px-3 py-2 shadow-md border border-gray-700 w-64 z-20"
              >
                <input
                  type="text"
                  value={profilelink}
                  readOnly
                  title={profilelink}
                  className="flex-1 bg-transparent text-sm text-white outline-none truncate"
                />
                <button
                  className="ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition"
                  onClick={copylink}
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mx-4">
        {/* Profile  */}
        <div className="relative flex items-center mb-4 gap-4">
          <div className="w-28 h-28 rounded-full shadow-lg overflow-hidden">
            {user.ProfilePicture ? (
              <img
                src={user.ProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
            )}
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
            <span className="text-sm text-[var(--text-secondary)]">
              Friends
            </span>
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
                      <button
                        onClick={() => setShowPopup(false)}
                        className="txt hover:text-[var(--btn)] transition-colors p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Friends List */}
                  <div className="flex-1 overflow-y-auto bg-sec-light pt-4">
                    {friendsList.length === 0 ? (
                      <p className="txt-dim text-center mt-10">
                        No friends yet
                      </p>
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

        {/* User Info */}
        <div className="text-[var(--text-primary)]">
          <h2 className="text-xl font-bold">
            {user.FirstName} {user.LastName}
          </h2>
          {user?.Bio && (
            <p className="text-[var(--text-secondary)] mb-4 max-w-xs">
              {user.Bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {!isCurrentUser && (
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <button
              onClick={handleGiveKudos}
              disabled={isCurrentUser || hasGivenKudos}
              className={`px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1 transition-colors
            ${
              isCurrentUser || hasGivenKudos
                ? "bg-gray-400/30 cursor-not-allowed"
                : "bg-white/20 hover:bg-white/30 text-[var(--text-primary)]"
            }
                `}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{hasGivenKudos ? "Kudos Given" : "Kudos"}</span>
            </button>

            <button className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>

            <button
              className={`${
                friendRequestStatus === "Add Friend"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : friendRequestStatus === "Cancel Request"
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-purple-400 hover:bg-purple-500"
              }  transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap cursor-pointer`}
              disabled={isFriendRequestLoading}
              onClick={handleFriendRequestAction}
            >
              <UserPlus className="w-5 h-5" />
              <span>{friendRequestStatus}</span>
            </button>
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {user.FieldOfStudy && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Landmark className="h-7 w-7 flex-shrink-0" />
            <div>
              <p className="text-xs">{user.University || "Field of Study"}</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.FieldOfStudy}
                {", " + user.GraduationYear || ""}
              </p>
            </div>
          </div>
        )}

        {user.OtherDetails?.skills && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Puzzle className="h-7 w-7 flex-shrink-0" />
            <div>
              <p className="text-xs">Skills</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.OtherDetails.skills}
              </p>
            </div>
          </div>
        )}
        {user.OtherDetails?.interests && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <DraftingCompass className="h-7 w-7 flex-shrink-0" />
            <div>
              <p className="text-xs">Interests</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.OtherDetails.interests}
              </p>
            </div>
          </div>
        )}
        {user.Country && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Earth className="h-7 w-7" />
            <div>
              <p className="text-xs">Country</p>
              <p className="text-lg text-[var(--text-primary)]">
                {user.Country}
              </p>
            </div>
          </div>
        )}
        {user.OtherDetails?.additionalNotes && (
          <div className="flex gap-3 text-[var(--text-secondary)]">
            <span>{user.OtherDetails.additionalNotes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
