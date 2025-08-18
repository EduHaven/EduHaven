import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";

import {
  User,
  MessageCircle,
  ThumbsUp,
  Edit3,
  Share2,
  UserPlus,
  Landmark,
  Earth,
  DraftingCompass,
  Puzzle,
  X
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Link, useParams } from "react-router-dom";
import { set } from "date-fns";
const backendUrl = import.meta.env.VITE_API_URL;

const ProfileCard = ({isCurrentUser = false}) => {
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friendsCount, setFriendsCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const { userId } = useParams();
  const [showLink, setShowLink] = useState(false);

   // user part for share functionality
   const profilelink = user?._id ? `${window.location.origin}/user/${user._id}` : "" ;

   //Logic part for share functionality
   const togglelink = () => setShowLink((prev) => !prev);

   const copylink =()=>{
     if(!profilelink) return;
     navigator.clipboard.writeText(profilelink)
     .then(() => {
       toast.success("Copied ");
       setShowLink(false);
     })
     .catch(()=> toast.error("Not Copied "));
   };


  const popupRef = useRef(null);

  useEffect(() => {
      const fetchFriendsCount = async() => {
        try {
          const response = await axios.get(`${backendUrl}/friends/count`, getAuthHeader());
          setFriendsCount(response.data.count);
          console.log("Friends count is:", response.data.count);
        } catch (error) {
          console.error("Error fetching friends count:", error);
        }
      };

      const fetchFriendsList = async () => {
        try {
          const response = await axios.get(
            `${backendUrl}/friends`,
            getAuthHeader()
          );
          setFriendsList(response.data);
        } catch (error) {
          console.error("Error fetching friends list:", error);
        }
      };

      fetchFriendsCount();
      fetchFriendsList();
    }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        if (isCurrentUser) {
          const token = localStorage.getItem("token");
          if (!token) return;

          const decoded = jwtDecode(token);
          response = await axios.get(
            `${backendUrl}/user/details?id=${decoded.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          response = await axios.get(`${backendUrl}/user/details?id=${userId}`);
        }
        setUser(response.data);
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
      <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/50 to-purple-500/5 rounded-3xl shadow-2xl pt-6 w-full h-fit relative overflow-hidden">
        {/* Skeleton nav */}
        <div className="flex justify-end gap-6 px-4">
          {isCurrentUser && <div className="w-6 h-6 rounded-full bg-gray-400/30"></div>}
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
                  <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-between gap-2 z-50">
                         <span className="text-sm text-gray-700 truncate">  {profilelink} </span>
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
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
              342
            </span>
            <span className="text-sm text-[var(--text-secondary)]">Kudos</span>
          </div>
          <div 
            onClick={() => setShowPopup(!showPopup)} 
            className="text-center flex-1 cursor-pointer hover:bg-white/20 rounded-lg p-2 transition-colors"
            ref={popupRef}
          >
            <span className="block text-2xl font-bold text-[var(--text-primary)]">
              {friendsCount}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">
              Friends
            </span>
          </div>

          {/* Updated Popup */}
          {showPopup && (
            <div className="fixed bg-transparent/50 inset-0 flex items-center justify-center z-50 p-4 sm:p-4">
              <div 
                ref={popupRef}
                className="w-full max-w-80  sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-2/5 sm:h-96 md:h-[28rem] lg:h-[32rem] bg-ter rounded-2xl shadow-2xl flex flex-col "
              >
                {/* Header */}
                <div className="bg-gray-800 border-b border-gray-600 p-4 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-2xl font-bold text-white-100">Friends List</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400 bg-gray-900 px-3 py-1 rounded-full">
                      {friendsCount} friends
                    </span>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-white hover:text-indigo-200 transition-colors p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Friends List */}
                <div className="flex-1 overflow-y-auto bg-gray-900 pt-4">
                  <div className="bg-gray-900">
                    {friendsList.map((friend) => (
                      <div 
                        key={friend._id}
                        className="flex items-center gap-3 p-4 cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-full flex-shrink-0">
                          {friend.ProfilePicture ? (
                            <img
                              src={friend.ProfilePicture}
                              className="w-full h-full object-cover"
                              alt={`${friend.FirstName}'s profile`}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                              <User className="w-5 h-5 text-white-100" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-white-100 font-bold text-xl truncate">
                            {friend.FirstName
                              ? `${friend.FirstName} ${friend.LastName || ""}`
                              : "old-user"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
        <div className="flex flex-wrap justify-center gap-4 my-4">
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <ThumbsUp className="w-5 h-5" />
            <span>Kudos</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 flex-1">
            <MessageCircle className="w-5 h-5" />
            <span>Chat</span>
          </button>
          {!isCurrentUser && (
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors text-[var(--text-primary)] px-6 py-2 h-10 rounded-lg flex items-center space-x-2 w-full sm:w-auto text-center flex-1 text-nowrap">
              <UserPlus className="w-5 h-5" />
              <span>Add friend</span>
            </button>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
        {user.FieldOfStudy && (
          <div className="flex items-center gap-4 text-[var(--text-secondary)]">
            <Landmark className="h-7 w-7" />
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
            <Puzzle className="h-7 w-7" />
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
            <DraftingCompass className="h-7 w-7" />
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
