import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, UserPlus, MoreVertical } from "lucide-react";
const backendUrl = import.meta.env.VITE_API_URL;

function SuggestedFriends({ onViewSentRequests }) {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdrownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdrownRef.current && !dropdrownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]); 

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const sendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/friends/request/${friendId}`,
        null,
        getAuthHeader()
      );
      console.log("Response:", response.data.message);
      setSuggestedFriends((prevUsers) =>
        prevUsers.map((user) =>
          user._id === friendId ? { ...user, requestSent: true } : user
        )
      );
    } catch (error) {
      console.error("Error adding friend:", error.response.data);
    }
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/friends/friend-suggestions`, getAuthHeader())
      .then((response) => {
        setSuggestedFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  if (suggestedFriends.length === 0) return null;

  return (
    <section className="bg-sec rounded-3xl p-4 relative ">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold txt">Suggested Friends</h3>
        <div className="relative" ref={dropdrownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <MoreVertical className="w-5 h-5 txt" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-ter rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onViewSentRequests();
                }}
                className="block w-full text-left px-4 py-2 text-sm txt hover:bg-sec"
                style={{ borderColor: "var(--txt-dim)" }}
              >
                Show Sent Requests
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {suggestedFriends
          .slice()
          .reverse()
          .map((user) => (
            <div key={user._id} className=" relative group py-1 bg-slate-4 00">
              <div className="flex items-center">
                {user.ProfilePicture ? (
                  <img
                    src={user.ProfilePicture}
                    className="w-11 h-11 rounded-full"
                    alt="Profile"
                  />
                ) : (
                  <div className="p-2 bg-ter rounded-full">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <div className="ml-4 flex-1 overflow-hidden">
                  <h4 className="text-lg font-medium line-clamp-1 txt">
                    {user.FirstName
                      ? `${user.FirstName} ${user.LastName || ""}`
                      : "old-user"}
                  </h4>
                  <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
                </div>
              </div>
              <div className=" absolute top-[8%] right-0 bg-sec p-1.5 px-2 transition-all opacity-0 group-hover:opacity-100">
                {user.requestSent ? (
                  <button
                    disabled
                    className="w-full border border-gray-500/50 text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition bg-sec txt"
                  >
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="w-full bg-ter text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition hover:bg-[var(--btn-hover)] txt"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Friend
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default SuggestedFriends;
