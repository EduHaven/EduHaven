import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {
  BarChart2,
  GamepadIcon,
  LogIn,
  Radio,
  User,
  BadgeInfo,
  FileVideo2
} from "lucide-react";

function Layout() {
  const location = useLocation();
  const socket=useRef(null);
  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token=localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const response = await axios.get(`http://localhost:3000/user/details?id=${decoded.id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  

  if (!user && !socket) return <div>Loading...</div>;

  useEffect(()=>{
    if (!user) return;
    try{
      socket.current=new WebSocket('ws://localhost:3000');
      socket.current.onopen = () => {
             
        socket.current.send(JSON.stringify({ type: "register", userId:user?._id }));
        console.log("WebSocket connected");   
      };
    }catch(err)
    {
      console.error("Error Registering:", err);
    }
  },[user?._id])
  
  


  const SidebarLink = ({ to, IconComponent, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className="relative flex flex-col items-center justify-center p-2 group hover:bg-gray-700 rounded-lg transition-colors"
      >
        {/* Active Indicator */}
        <span
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 h-8 w-1 rounded transition-all duration-300 ${
            isActive
              ? "bg-purple-500 opacity-100"
              : "bg-transparent opacity-0 group-hover:opacity-50"
          }`}
        />
        <IconComponent
          className={`w-6 h-6 transition-colors duration-300 ${
            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
          }`}
        />
        <span className="mt-1 text-xs text-gray-400">{label}</span>
      </Link>
    );
  };

  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-300">
      {/* Sidebar */}
      <nav className="w-[4.5rem] border border-transparent border-r-gray-800 p-1 flex flex-col items-center justify-between fixed top-0 left-0 h-screen shadow-lg">
        <div>
          <Link to="/">
            <img
              src="../public/Logo2.svg"
              alt="Logo"
              className={`w-full m-auto object-contain p-4 hover:bg-gray-700 rounded-xl transition-opacity duration-300 ${
                isHome ? "opacity-100" : "opacity-80"
              }`}
            />
          </Link>
          <div className="space-y-5 my-4">
            <SidebarLink
              to="/study-room"
              IconComponent={Radio}
              label="Session"
            />
            <SidebarLink
              to="/stats"
              IconComponent={BarChart2}
              label="Stats"
            />
            <SidebarLink
              to="/games"
              IconComponent={GamepadIcon}
              label="Games"
            />
            <SidebarLink to="/course" IconComponent={FileVideo2} label="course" />
          </div>
          <hr className="border-gray-700 my-5 mx-4" />
          <SidebarLink
            to="/project-details"
            IconComponent={BadgeInfo}
            label="About"
          />
        </div>

        <div className="space-y-8">
          {!user && (
            <Link
              to="/authenticate"
              className={`block p-3 rounded-lg transition-colors ${
                location.pathname === "/authenticate"
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <LogIn className="w-6 h-6" />
            </Link>
          )}

          {token && (
            <Link
              to="/profile"
              className={`block p-3 rounded-lg transition-colors ${
                location.pathname === "/profile"
                  ? "bg-purple-600"
                  : "hover:bg-gray-700"
              }`}
            >
              <User className="w-6 h-6" />
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-20">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
