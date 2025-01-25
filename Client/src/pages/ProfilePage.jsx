import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Trash } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import as named import

const ProfilePage = () => {
  const [user, setUser] = useState(null); // To store user details
  const [bio, setBio] = useState("This is your bio. Add something about yourself.");
  const [isEditingBio, setIsEditingBio] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from local storage
  
    console.log("Token from local storage:", token); // Debug log to verify token retrieval
  
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token to get user info
        console.log("Decoded token:", decoded); // Debug log to verify the decoded token
        setUser(decoded); // Store decoded info in the state (userId, FullName)
      } catch (error) {
        console.error("Error decoding token:", error); // Handle decoding errors
      }
    }
  }, []);
  

  useEffect(() => {
    if (user) {
      // If user is set, fetch user details from backend
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/user/details?id=${user.userId}`);
          console.log("User details fetched:", response.data); // Add this line to see the backend response
          setUser(response.data); // Update user state with data from backend
        } catch (error) {
          console.error("Error fetching user details:", error); // Handle errors from the backend request
        }
      };

      fetchUserDetails();
    }
  }, [user]);

  const handleBioEdit = () => {
    setIsEditingBio(!isEditingBio);
    if (isEditingBio && user) {
      // Save bio to the backend
      axios
        .put(`http://localhost:3000/user/update-bio`, { bio, userId: user.userId }) // Pass userId with bio
        .then(() => console.log("Bio updated successfully!"))
        .catch((err) => console.error("Failed to update bio:", err));
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  return (
    <div className="text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Card */}
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600"></div>

        {/* Profile Info */}
        <div className="flex flex-col items-center -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 overflow-hidden shadow-lg">
            <img
              src={user.UserProfile || "https://via.placeholder.com/150"}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mt-4">{user.FullName}</h2>
          <button className="mt-2 px-6 py-2 bg-purple-600 text-sm font-medium rounded-lg hover:bg-purple-700 transition">
            Edit User Profile
          </button>
        </div>

        {/* Bio Section */}
        <div className="px-8 py-6">
          <label className="block text-sm font-semibold text-gray-300">Bio</label>
          {isEditingBio ? (
            <textarea
              className="w-full mt-2 p-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="mt-2">{bio}</p>
          )}
          <button
            onClick={handleBioEdit}
            className="mt-2 px-4 py-2 bg-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            {isEditingBio ? "Save" : "Edit"}
          </button>
        </div>

        {/* Details Section */}
        <div className="px-8 py-6 border-t border-gray-600">
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-300">Email</label>
              <div className="">{user.Email}</div>
            </div>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-300">User ID</label>
              <div className="">{user.userId}</div>
            </div>
          </div>
        </div>

        {/* Friends Section */}
        <div className="px-8 py-6">
          <label className="block text-sm font-semibold text-gray-300">Friends</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            <p className="block text-sm font-semibold text-gray-400">This feature is coming soon!</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <Link
          to="/signout"
          className="mt-6 px-6 py-2 bg-red-600 text-sm font-medium rounded-lg hover:bg-red-700 transition"
        >
          <LogOut />
          Logout
        </Link>
        <Link
          to="/delete-account"
          className="mt-6 px-6 py-2 bg-red-600 text-sm font-medium rounded-lg hover:bg-red-700 transition"
        >
          <Trash />
          Delete account
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
