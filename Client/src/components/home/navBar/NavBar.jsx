import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import Ai from "./AiChatbot.jsx";
import PinnedLinks from "./PinnedLinks.jsx";
import Slogan from "./Slogan.jsx";
import OnlineUsers from "./OnlineUsers.jsx";
import Calculator from "./Calculator.jsx";
import { useUserProfile } from "../../../contexts/UserProfileContext.jsx";

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // for AI, do not remove
  const { token } = useUserProfile();
  useEffect(() => {
    const currentToken = token;
    if (currentToken) setIsLoggedIn(true);
  }, [token]);

  return (
    <div className="flex justify-between items-center bg-transparent z-10">
      <PinnedLinks />
      <Slogan />
      <div className="flex items-center gap-4">
        {isLoggedIn && <OnlineUsers />}
        <Ai onShowId={setSelectedId} />
        <Calculator />
        {!isLoggedIn && (
          <Link
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            to="/auth/login"
          >
            <User className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
