import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";
import { useUserProfile } from "@/contexts/UserProfileContext";
const Signout = () => {
  const navigate = useNavigate();
  const {  clearAll } = useUserProfile();
  useEffect(() => {
    const handleSignOut = async () => {
      console.log("inside signout");
      try {
        await axiosInstance.post(`/auth/logout`, {}, { withCredentials: true });

        clearAll();
        console.log("user logged out ");
        localStorage.removeItem("activationToken");
        navigate("/", { replace: true });
        // window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    };

    handleSignOut();
  }, [navigate, clearAll]);

  return null;
};

export default Signout;
