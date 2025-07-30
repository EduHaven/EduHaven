import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import Ai from "./AiChatbot.jsx";
import PinnedLinks from "./PinnedLinks.jsx";
import Slogan from "./Slogan.jsx";
import OnlineUsers from "./OnlineUsers.jsx";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // for AI, do not remove

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-transparent z-10 gap-3 sm:gap-0">
      <div className="w-full sm:w-auto order-2 sm:order-1">
        <PinnedLinks />
      </div>
      <div className="order-1 sm:order-2">
        <Slogan />
      </div>
      <div className="flex items-center gap-2 sm:gap-4 order-3">
        {isLoggedIn && <OnlineUsers />}
        <Ai onShowId={setSelectedId} />
        {!isLoggedIn && (
          <Link
            className="bg-green-600 hover:bg-green-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base"
            to="/authenticate"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Login</span>
            <span className="sm:hidden">Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
