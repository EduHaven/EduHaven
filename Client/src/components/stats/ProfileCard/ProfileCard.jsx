// components/ProfileCard/ProfileCard.jsx
import axiosInstance from "@/utils/axios";
import { jwtDecode } from "jwt-decode";
import { MessageCircle, ThumbsUp, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

import {
  useAcceptRequest,
  useCancelRequest,
  useSendRequest,
} from "@/queries/friendQueries";
import FriendsPopup from "./FriendsPopup";
import ProfileDetails from "./ProfileDetails";
import ProfileHeader from "./ProfileHeader";
import ProfileSkeleton from "./ProfileSkeleton";

const ProfileCard = ({ isCurrentUser = false }) => {
  // ... keep all your state & logic here
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [showLink, setShowLink] = useState(false);
  const [kudosCount, setKudosCount] = useState(0);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);
  const [friendRequestStatus, setFriendRequestStatus] = useState("Add Friend");
  const [isFriendRequestLoading, setIsFriendRequestLoading] = useState(false);

  const { mutate: sendRequest } = useSendRequest();
  const { mutate: cancelRequest } = useCancelRequest();
  const { mutate: acceptRequest } = useAcceptRequest();

  const { userId } = useParams();
  const shareRef = useRef(null);
  const popupRef = useRef(null);

  const profilelink = user?._id
    ? `${window.location.origin}/user/${user._id}`
    : "";

  const toggleLink = () => setShowLink((prev) => !prev);
  const copyLink = () => {
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
      sendRequest(userId);
      setFriendRequestStatus("Cancel Request");
      setIsFriendRequestLoading(false);
    } else if (friendRequestStatus === "Cancel Request") {
      cancelRequest(userId);
      setFriendRequestStatus("Add Friend");
      setIsFriendRequestLoading(false);
    } else if (friendRequestStatus === "Accept Request") {
      acceptRequest(userId);
      setFriendRequestStatus("Friends");
      setIsFriendRequestLoading(false);
    }
  };

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
      await axiosInstance.post("/user/kudos", {
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

  if (isLoading || !user) return <ProfileSkeleton />;

  return (
    <div className="bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-md pt-6 w-full h-fit relative overflow-hidden">
      {/* Header */}
      <ProfileHeader
        isCurrentUser={isCurrentUser}
        user={user}
        profilelink={profilelink}
        showLink={showLink}
        toggleLink={toggleLink}
        copyLink={copyLink}
        shareRef={shareRef}
        kudosCount={kudosCount}
        friendsCount={friendsList.length}
        setShowPopup={setShowPopup}
        popupRef={popupRef}
      />

      <div className="mx-4">
        {/* Friends Popup */}
        <FriendsPopup
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          friendsList={friendsList}
          popupRef={popupRef}
          user={user}
          kudosCount={kudosCount}
        />

        {/* User Info + Action Buttons + Details */}
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

        {!isCurrentUser && (
          <div className="flex flex-wrap justify-center gap-4 my-4">
            <Button
              onClick={handleGiveKudos}
              disabled={isCurrentUser || hasGivenKudos}
              variant={
                isCurrentUser || hasGivenKudos ? "transparent" : "default"
              }
              className={`px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1 ${
                isCurrentUser || hasGivenKudos
                  ? "bg-gray-400/30 cursor-not-allowed"
                  : ""
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{hasGivenKudos ? "Kudos Given" : "Kudos"}</span>
            </Button>

            <Button
              variant="default"
              className="px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1 bg-white/20 hover:bg-white/30 text-[var(--text-primary)]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </Button>

            <Button
              disabled={isFriendRequestLoading}
              onClick={handleFriendRequestAction}
              variant="default"
              className={`px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap cursor-pointer ${
                friendRequestStatus === "Add Friend"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : friendRequestStatus === "Cancel Request"
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-purple-400 hover:bg-purple-500"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>{friendRequestStatus}</span>
            </Button>
          </div>
        )}
      </div>

      {user.FieldOfStudy ||
      user.OtherDetails?.skills ||
      user.OtherDetails?.interests ||
      user.Country ||
      user.OtherDetails?.additionalNotes ? (
        <ProfileDetails user={user} />
      ) : (
        <div className="h-3"></div>
      )}
    </div>
  );
};

export default ProfileCard;
