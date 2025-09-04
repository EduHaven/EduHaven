import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

function FriendRequests() {
  const [friendRequests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/friends/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = (friendId) => {
    axiosInstance
      .post(`/friends/accept/${friendId}`, null)
      .then((res) => {
        console.log(res.data);
        setRequests((prev) => prev.filter((user) => user._id !== friendId));
      })
      .catch((err) => console.error(err.response.data));
  };

  const handleReject = (friendId) => {
    axiosInstance
      .delete(`/friends/reject/${friendId}`, null)
      .then((res) => {
        console.log(res.data);
        setRequests((prev) => prev.filter((user) => user._id !== friendId));
      })
      .catch((err) => console.error(err.response.data));
  };

  if (loading) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-gray-700/30 p-4 space-y-4 rounded-3xl shadow animate-pulse">
        <div className="bg-gray-500/20 h-6 rounded-md"></div>
        <div className="space-y-4 pt-4">
          <div className="flex justify-start items-center space-x-2 my-2">
            {/* avtar */}
            <div className="h-14 aspect-square bg-gray-500/20 rounded-full"></div>
            {/* name + bio  */}
            <div className="flex flex-col flex-1 justify-center items-start space-y-2">
              <div className="h-5 w-8/12 bg-gray-500/20 rounded-md"></div>
              <div className="h-3 w-full bg-gray-500/20 rounded-md"></div>
            </div>
          </div>
          {/* buttons */}
          <div className="flex items-center px-2 justify-between">
            <div className="w-[40%] h-8 bg-gray-500/20 rounded-md"></div>
            <div className="w-[40%] h-8 bg-gray-500/20 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (friendRequests.length === 0) {
    return null;
  }

  return (
    <section className="bg-sec rounded-3xl p-3 2xl:p-4">
      <h3 className="text-xl font-semibold txt">Friend Requests</h3>
      <div className="space-y-4">
        {friendRequests.map((user) => (
          <div key={user._id} className="!mt-7">
            <Link
              className="flex items-center space-x-2"
              to={`/user/${user._id}`}
            >
              <Avatar src={user.ProfilePicture} alt={"Profile"} />
              <div>
                <h1 className="text-lg font-medium line-clamp-1 txt hover:underline">
                  {user.FirstName
                    ? `${user.FirstName} ${user.LastName || ""}`
                    : "old-user"}
                </h1>
                <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
              </div>
            </Link>
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
