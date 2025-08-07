import { useEffect, useState } from "react";
import { User } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
const backendUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/friends`,
        getAuthHeader()
      );
      // Add an `isRemoved` property to each friend (initially false)
      const friendsWithFlag = response.data.map((friend) => ({
        ...friend,
        isRemoved: false,
      }));
      setFriends(friendsWithFlag);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`${backendUrl}/friends/${friendId}`, getAuthHeader());
      setFriends(
        friends.map((friend) =>
          friend._id === friendId ? { ...friend, isRemoved: true } : friend
        )
      );
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-md flex justify-between bg-sec"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-ter rounded-full animate-pulse"></div>
            <div className="h-5 bg-ter rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 bg-ter rounded w-20 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold txt">Friends List</h1>
        <Link to={"/session"} className="hover:underline txt">
          Find friends
        </Link>
      </div>
      
      {loading ? (
        <LoadingSkeleton />
      ) : friends.length === 0 ? (
        <p className="txt">No friends yet.</p>
      ) : (
        <ul className="space-y-2 min-w-[600px] rounded-2xl overflow-hidden">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="p-4 rounded-md flex justify-between bg-sec"
            >
              <div className="flex items-center gap-4">
                {friend.ProfilePicture ? (
                  <img
                    src={friend.ProfilePicture}
                    className="w-9 h-9 rounded-full"
                    alt="profile"
                  />
                ) : (
                  <div className="p-2 bg-ter rounded-full">
                    <User className="w-7 h-7" />
                  </div>
                )}
                <h4 className="text-lg font-medium line-clamp-1 txt">
                  {friend.FirstName
                    ? `${friend.FirstName} ${friend.LastName || ""}`
                    : "old-user"}
                </h4>
              </div>
              <button
                onClick={() => removeFriend(friend._id)}
                disabled={friend.isRemoved}
                className={`transition-colors duration-300 txt px-3 py-1 rounded ${
                  friend.isRemoved ? "bg-ter" : "bg-ter hover:bg-red-500"
                }`}
              >
                {friend.isRemoved ? "Friend Removed" : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Friends;