import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { toast } from "react-toastify";

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await axiosInstance.post(`/auth/logout`, {}, { withCredentials: true });

        localStorage.removeItem("token");
        localStorage.removeItem("activationToken");
        navigate("/", { replace: true });
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    };

    handleSignOut();
  }, [navigate]);

  return null;
};

export default Signout;
