import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {
  BarChart2,
  BookOpen,
  GamepadIcon,
  LogIn,
  User,
  Headphones,
  BadgeInfo,
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
  
  


  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <nav className="w-20 bg-gray-800 p-4 flex flex-col items-center justify-between fixed top-0 left-0 h-screen">
        <div className="space-y-6">
          <Link to={"/"}>
            <img
              src="../public/Logo2.svg"
              alt="Logo"
              className="w-full p-2.5 hover:bg-gray-700 rounded-lg "
            />
          </Link>
          <Link
            to="/dashboard"
            className={`block p-3 rounded-lg transition-colors ${
              location.pathname === "/dashboard"
                ? "bg-purple-600"
                : "hover:bg-gray-700"
            }`}
          >
            <BarChart2 className="w-6 h-6" />
          </Link>

          <Link
            to="/games"
            className={`block p-3 rounded-lg transition-colors ${
              location.pathname === "/games"
                ? "bg-purple-600"
                : "hover:bg-gray-700"
            }`}
          >
            <GamepadIcon className="w-6 h-6" />
          </Link>

          <Link
            to="/music"
            className={`block p-3 rounded-lg transition-colors ${
              location.pathname === "/music"
                ? "bg-purple-600"
                : "hover:bg-gray-700"
            }`}
          >
            <Headphones className="w-6 h-6" />
          </Link>
      
          <hr />
          <Link
            to="/project-details"
            className={`block p-3 rounded-lg transition-colors ${
              location.pathname === "/project-details"
                ? "bg-purple-600"
                : "hover:bg-gray-700"
            }`}
          >
            <BadgeInfo className="w-6 h-6" />
          </Link>
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

          {user && (
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
        <Outlet context={{ user , socket }}/>
      </main>
    </div>
  );
}

export default Layout;
