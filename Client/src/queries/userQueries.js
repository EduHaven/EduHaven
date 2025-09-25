import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "../api/userApi";
import { handleApiError } from "@/utils/errorHandler";

export const useAllUsers = () =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: fetchAllUsers,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    onError: (err) => handleApiError(err, "Error fetching all users"),
  });
