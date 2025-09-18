import { forwardRef, useEffect, useRef, useState } from "react";
import {
  BarChart2,
  Gamepad2,
  LogIn,
  Radio,
  Settings,
  BadgeInfo,
  Users,
  StickyNote,
  MessageCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const sidebarRef = useRef(null);
  const linkRefs = useRef({});
  const [indicatorPos, setIndicatorPos] = useState({ top: 0 });

  useEffect(() => {
    if (location.pathname === "/") return;
    const activeLink = linkRefs.current[location.pathname];
    if (sidebarRef.current && activeLink) {
      const containerRect = sidebarRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const indicatorHeight = 32;
      const top =
        linkRect.top -
        containerRect.top +
        linkRect.height / 2 -
        indicatorHeight / 2;
      setIndicatorPos({ top });
    }
  }, [location.pathname]);

  const SidebarLink = forwardRef(
    ({ to, IconComponent, label, isActive }, ref) => {
      return (
        <Link
          to={to}
          ref={ref}
          className="relative flex flex-col items-center justify-center pt-2.5 pb-2 group hover:bg-ter rounded-lg transition-colors"
        >
          <IconComponent
            className={`size-5 2xl:size-6 transition-colors duration-300 ${
              isActive ? "txt" : "!txt-disabled group-hover:txt"
            }`}
          />
          <span className="text-xs txt-dim">{label}</span>
        </Link>
      );
    }
  );
  SidebarLink.displayName = "SidebarLink";

  return (
    <nav
      ref={sidebarRef}
      className="w-[70px] border-r border-gray-500/20 p-1 flex flex-col items-center justify-between fixed top-0 left-0 h-screen "
    >
      <div>
        <Link to="/">
          <div className="hover:bg-ter rounded-lg transition-opacity duration-300 ">
            <img
              src="./Logo.svg"
              alt="Logo"
              className={`w-full m-auto object-contain p-4 logo-filter ${
                isHome ? "opacity-100" : "opacity-80"
              }`}
            />
          </div>
        </Link>
        <div className="space-y-2.5 2xl:space-y-4 mt-1 2xl:mt-2">
          <SidebarLink
            to="/session"
            IconComponent={Radio}
            label="Session"
            isActive={location.pathname === "/session"}
            ref={(el) => (linkRefs.current["/session"] = el)}
          />
          <SidebarLink
            to="/stats"
            IconComponent={BarChart2}
            label="Stats"
            isActive={location.pathname === "/stats"}
            ref={(el) => (linkRefs.current["/stats"] = el)}
          />
          <SidebarLink
            to="/chat"
            IconComponent={MessageCircle}
            label="Chat"
            isActive={location.pathname === "/chat"}
            ref={(el) => (linkRefs.current["/chat"] = el)}
          />
          <SidebarLink
            to="/notes"
            IconComponent={StickyNote}
            label="Notes"
            isActive={location.pathname === "/notes"}
            ref={(el) => (linkRefs.current["/notes"] = el)}
          />
          <SidebarLink
            to="/friends"
            IconComponent={Users}
            label="Friends"
            isActive={location.pathname === "/friends"}
            ref={(el) => (linkRefs.current["/friends"] = el)}
          />

          <SidebarLink
            to="/games"
            IconComponent={Gamepad2}
            label="Games"
            isActive={location.pathname === "/games"}
            ref={(el) => (linkRefs.current["/games"] = el)}
          />
        </div>

        <hr className="border-[var(--txt-disabled)] opacity-50 md:my-2.5 2xl:my-4 mx-4" />
        <SidebarLink
          to="/about"
          IconComponent={BadgeInfo}
          label="About"
          isActive={location.pathname === "/about"}
          ref={(el) => (linkRefs.current["/about"] = el)}
        />
      </div>

      <div className="space-y-2 w-full">
        {!token && (
          <SidebarLink
            to="/auth/login"
            IconComponent={LogIn}
            label="Login"
            isActive={location.pathname === "/auth/login"}
            ref={(el) => (linkRefs.current["/auth/login"] = el)}
          />
        )}
        <SidebarLink
          to="/settings"
          IconComponent={Settings}
          label="Settings"
          isActive={location.pathname === "/settings"}
          ref={(el) => (linkRefs.current["/settings"] = el)}
        />
      </div>

      {/* Render the animated active indicator only if not on the home page */}
      {!isHome && (
        <motion.span
          className="absolute left-1 h-8 w-1 rounded-full bg-[var(--btn)]"
          animate={{ top: indicatorPos.top }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </nav>
  );
}

export default Sidebar;
