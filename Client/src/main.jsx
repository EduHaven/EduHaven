
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";
import { useUserStore } from "./stores/userStore";
import { jwtDecode } from "jwt-decode";


const root = document.getElementById("root");

function InitUserData() {
  const setUser = useUserStore((state) => state.setUser);
  const fetchUserDetails = useUserStore((state) => state.fetchUserDetails);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp;
      if (exp && Date.now() >= exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/login";
        return;
      }
      // Fetch user details if token is valid
      if (decoded && decoded.userId) {
        fetchUserDetails(decoded.userId);
      }
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
    }
  }, [fetchUserDetails, setUser]);
  return null;
}

createRoot(root).render(
  <StrictMode>
    <InitUserData />
    <App className="transition-all" />
    <Analytics />
  </StrictMode>
);
