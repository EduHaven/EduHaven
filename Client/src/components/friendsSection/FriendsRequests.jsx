import axios from "axios";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_API_URL;

function FriendRequests() {
  const [friendRequests, setRequests] = useState([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/friends/requests`, getAuthHeader())
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => console.error(err.response.data));
  }, []);

  const handleAccept = (friendId) => {
    axios
      .post(
        `${backendUrl}/friends/accept/${friendId}`,
        null,
        getAuthHeader()
      )
      .then((res) => {
        console.log(res.data);
        setRequests((prev) => prev.filter((user) => user._id !== friendId));
      })
      .catch((err) => console.error(err.response.data));
  };

  const handleReject = (friendId) => {
    axios
      .post(
        `${backendUrl}/friends/reject/${friendId}`,
        null,
        getAuthHeader()
      )
      .then((res) => {
        console.log(res.data);
        setRequests((prev) => prev.filter((user) => user._id !== friendId));
      })
      .catch((err) => console.error(err.response.data));
  };

  if (friendRequests.length === 0) return null;

  return (
    <section className="bg-sec rounded-3xl p-3 2xl:p-4">
      <h3 className="text-xl font-semibold txt">Friend Requests</h3>
      <div className="space-y-4">
        {friendRequests.map((user) => (
          <div key={user.id} className="!mt-7">
            <div className="flex items-center">
              {user.ProfilePicture ? (
                <img
                  src={user.ProfilePicture}
                  className="w-12 h-12 rounded-full"
                  alt="Profile"
                />
              ) : (
                <div className="p-2.5 bg-ter rounded-full">
                  <User className="w-7 h-7" />
                </div>
              )}
              <div className="ml-4">
                <h4 className="text-lg font-medium line-clamp-1 txt">
                  {user.FirstName
                    ? `${user.FirstName} ${user.LastName || ""}`
                    : "old-user"}
                </h4>
                <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
              </div>
            </div>
            <div className="m-4 flex space-x-3">
              <button
                onClick={() => handleReject(user._id)}
                className="flex-1 border border-gray-500/50 hover:bg-red-500 text-red-400 hover:text-white text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
              >
                Decline
              </button>
              <button
                onClick={() => handleAccept(user._id)}
                className="flex-1 btn hover:bg-purple-600 hover:text-white text-sm px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FriendRequests;
