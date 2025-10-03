import { create } from "zustand";
import axiosInstance from "@/utils/axios";

export const useUserStore = create((set, get) => {
  return {
    user: null,
    setUser: (userData) => set({ user: userData }),
    fetchUserDetails: async (userId) => {
      try {
        const response = await axiosInstance.get(`/user/details?id=${userId}`);
        set({ user: response.data });
        return response.data;
      } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
      }
    },
    isProfileComplete: () => {
      const user = get().user;
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
      const user = get().user;
      if (!user) return false;
      const basicFields = ["FirstName", "LastName", "Country", "Bio", "Gender"];
      return basicFields.every((f) => user[f]);
    },
    isEduSkillsComplete: () => {
      const user = get().user;
      if (!user) return false;
      const eduFields = ["University", "FieldOfStudy", "GraduationYear"];
      return eduFields.every((f) => user[f]);
    },
    updateUser: async (userId, updatedData) => {
      try {
        const response = await axiosInstance.put(
          `/user/update?id=${userId}`,
          updatedData
        );
        set({ user: response.data });
        return response.data;
      } catch (error) {
        console.error("Error updating user:", error);
        return null;
      }
    },
    fetchUserStats: async (userId) => {
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
    },
  };
});
