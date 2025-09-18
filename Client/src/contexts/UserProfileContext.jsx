import { createContext, useContext, useState } from "react";
import axiosInstance from "@/utils/axios";
import { fetchUserStats } from "@/utils/userUtils";

const UserProfileContext = createContext({
  user: null,
  setUser: () => {},
  fetchUserDetails: () => Promise.resolve(null),
  isProfileComplete: () => false,
  isBasicInfoComplete: () => Promise.resolve(false),
  isEduSkillsComplete: () => Promise.resolve(false),
});

// Provider component
export const UserProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const isProfileComplete = () => {
    if (!user) return false;

    const requiredFields = [
      "FirstName",
      "LastName",
      "Email",
      "Bio",
      "Gender",
      "University",
      "Country",
      "FieldOfStudy",
      "GraduationYear",
    ];

    return requiredFields.every((field) => {
      const value = user[field];
      return value !== null && value !== undefined && value !== "";
    });
  };

  const isBasicInfoComplete = () => {
    if (!user) return false;
    const basicFields = ["FirstName", "LastName", "Country", "Bio", "Gender"];
    return basicFields.every((f) => user[f]);
  };

  const isEduSkillsComplete = () => {
    if (!user) return false;
    const eduFields = ["University", "FieldOfStudy", "GraduationYear"];
    return eduFields.every((f) => user[f]);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/details?id=${userId}`);
      const userData = response.data;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        user,
        setUser,
        fetchUserDetails,
        isProfileComplete,
        isBasicInfoComplete,
        isEduSkillsComplete,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook for using user profile context
// eslint-disable-next-line react-refresh/only-export-components
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
// eslint-disable-next-line react-refresh/only-export-components
export const fetchUserStats = async (userId) => {
  try {
    const response = await axiosInstance.get(`/friends/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user stats:",
      error.response?.data || error.message
    );
    throw error;
  }
};