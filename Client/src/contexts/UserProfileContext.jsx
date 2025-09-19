import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/utils/axios";

const useUserProfile = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,

      // Actions
      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      clearUser: () => set({ user: null }),

      clearToken: () => set({ token: null }),

      clearAll: () => set({ user: null, token: null }),

      // Helper functions
      isProfileComplete: () => {
        const { user } = get();
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
      },

      isBasicInfoComplete: () => {
        const { user } = get();
        if (!user) return false;

        const basicFields = [
          "FirstName",
          "LastName",
          "Country",
          "Bio",
          "Gender",
        ];
        return basicFields.every((f) => user[f]);
      },

      isEduSkillsComplete: () => {
        const { user } = get();
        if (!user) return false;

        const eduFields = ["University", "FieldOfStudy", "GraduationYear"];
        return eduFields.every((f) => user[f]);
      },

      // Async actions

      fetchUserDetails: async (userId) => {
        try {
          const response = await axiosInstance.get(
            `/user/details?id=${userId}`
          );

          // Extract and store token
          const token = response.config.headers.Authorization.replace(
            "Bearer ",
            ""
          );
          // console.log("User Details Token:", token);

          const userData = response.data;
          console.log("User Data:", userData, token);

          // Update both user and token in store
          set({ user: userData });

          return userData;
        } catch (error) {
          console.error("Error fetching user details:", error);
          return null;
        }
      },
    }),
    {
      name: "user-profile-storage", // Storage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }), // Only persist user and token
    }
  )
);

/**
 * Fetches the full public stats of a user by userId.
 *
 * @param {string} userId - The ID of the user whose stats are to be fetched.
 * @returns {Promise<Object>} - Resolves with the user's stats data.
 * @throws {Error} - Throws an error if the API call fails.
 */

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

export { useUserProfile };
