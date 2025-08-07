import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_API_URL;

const Signout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No token found. User might already be logged out.");
      toast.error("No active session found. Already logged out.");
      navigate("/");
    }

    const handleSignOut = async () => {
      try {
        await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });

        localStorage.removeItem("token");
        localStorage.removeItem("activationToken");

        toast.success("Successfully logged out!");
        navigate("/");
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