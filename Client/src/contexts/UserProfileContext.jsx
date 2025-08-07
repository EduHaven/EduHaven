import { createContext, useContext, useState } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_API_URL;

const UserProfileContext = createContext({
  user: null,
  setUser: () => {},
  fetchUserDetails: () => Promise.resolve(null),
});

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/user/details?id=${userId}`
      );
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return (
    <UserProfileContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using user profile context
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
