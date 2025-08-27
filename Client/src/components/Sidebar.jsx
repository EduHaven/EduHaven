import React, { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  GamepadIcon,
  LogIn,
  Radio,
  Settings, 
  Edit3,
  BadgeInfo,
  Users, 
  Wrench
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

  const SidebarLink = React.forwardRef(
    ({ to, IconComponent, label, isActive }, ref) => {
      return (
        <Link
          to={to}
          ref={ref}
          className="relative flex flex-col items-center justify-center pt-2.5 pb-1.5 group hover:bg-ter rounded-lg transition-colors"
        >
          <IconComponent
            className={`w-6 h-6 transition-colors duration-300 ${isActive ? "txt" : "!txt-disabled group-hover:txt"
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
              className={`w-full m-auto object-contain p-4 logo-filter ${isHome ? "opacity-100" : "opacity-80"
                }`}
            />
          </div>
        </Link>
        <div className="space-y-5 mt-2">
          <SidebarLink
            to="/session"
            IconComponent={Radio}
            label="Session"
            isActive={location.pathname === "/session"}
            ref={(el) => (linkRefs.current["/session"] = el)}
          />
          {/* <SidebarLink
              to="/chat-room"
              IconComponent={MessageSquareText}
              label="chat"
              isActive={location.pathname === "/chat-room"}
              ref={(el) => (linkRefs.current["/chat-room"] = el)}
            /> */}
          <SidebarLink
            to="/stats"
            IconComponent={BarChart2}
            label="Stats"
            isActive={location.pathname === "/stats"}
            ref={(el) => (linkRefs.current["/stats"] = el)}
          />
          <SidebarLink
            to="/friends"
            IconComponent={Users}
            label="Friends"
            isActive={location.pathname === "/friends"}
            ref={(el) => (linkRefs.current["/friends"] = el)}
          />
          
          <SidebarLink
            to="/notenest"
            IconComponent={Wrench}  
            label="Tools"
            isActive={location.pathname === "/notenest"}
            ref={(el) => (linkRefs.current["/notenest"] = el)}
          />        
          <SidebarLink
            to="/planner"
            IconComponent={Edit3}
            label="Planner"
            isActive={location.pathname === "/planner"}
            ref={(el) => (linkRefs.current["/planner"] = el)}
         />

          <SidebarLink
            to="/games"
            IconComponent={GamepadIcon}
            label="Games"
            isActive={location.pathname === "/games"}
            ref={(el) => (linkRefs.current["/games"] = el)}
          />
          
        </div>

        <hr className="border-sec my-5 mx-4" />
        <SidebarLink
          to="/project-details"
          IconComponent={BadgeInfo}
          label="About"
          isActive={location.pathname === "/project-details"}
          ref={(el) => (linkRefs.current["/project-details"] = el)}
        />
      </div>

      <div className="space-y-2 w-full">
        {!token && (
          <SidebarLink
            to="/authenticate"
            IconComponent={LogIn}
            label="Login"
            isActive={location.pathname === "/authenticate"}
            ref={(el) => (linkRefs.current["/authenticate"] = el)}
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
