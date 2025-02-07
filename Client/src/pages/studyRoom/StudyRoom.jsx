import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Headphones, ExternalLink,UserPlus,Hourglass  } from "lucide-react";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Ai from "./AiChatbot.jsx";
import Calender from "./CalendarComponent.jsx";
import TimerComponent from "./TimerComponent.jsx";
import NotesComponent from "./NotesComponent.jsx";
import TodoComponent from "./TodoComponent.jsx";
import StudyStats from "./StudyStats.jsx";
import axios from "axios";

function StudyRoom() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedId, setSelectedId] = useState(""); // for AI. donot remove
  const [token, setToken] = useState(null); 
  const [otherUsers,setOtherUsers] = useState([]);
  
  const [status,setStatus] = useState([]);
  const {user,socket} = useOutletContext();
  if (!user && !socket && !otherUsers.length) return <div>Loading...</div>;

  useEffect(()=>{
    try{
      setToken(localStorage.getItem("token"));
    }catch(error){
      console.error("Error fetching token:", error);
    }

  },[]);

  useEffect(() => {
    try{
      if (token) setIsLoggedIn(true);
    }catch(error){
      console.error("Error logging in:", error);
    }
  }, [token]);

  
  
  useEffect(()=>{
    if (user && user._id) {
      (async () => {
        try {
          console.log(user._id);
          const response = await axios.get(
            `http://localhost:3000/user/${user._id}/users`
          );
          //console.log("Other User details fetched:", response.data);
          if(response.data.users.length!==0)
          setOtherUsers(response.data.users);
          
          

        } catch (error) {
          console.error("Error fetching all users details:", error);
        }
      })();
    }
  },[user?._id]);

  useEffect(()=>{
    try{
      setStatus(Array(otherUsers.length).fill("default"));
    }catch(error){
      console.error("Error setting statuses:", error);
    }
  },[otherUsers]);


  const handleRequest=async (personId,index)=>{
    try{
      // Compute the new status array based on the current state
      const newStatus = status.map((s, i) => {
        if (i === index) {
          // Toggle: if current status is "pending", set to "default", otherwise "pending"
          return s === "pending" ? "default" : "pending";
        }
        return s;
      });
      setStatus(newStatus);
      
      if(newStatus[index]==="pending")
      {
        console.log("Yes i was here!!!!!!!");
        socket.current.send(JSON.stringify({type:"friend-request",userId:user._id,userName:user.FullName,friendId:personId}));
      }
      else
      {
        socket.current.send(JSON.stringify({type:"cancel-request",userId:user._id,friendId:personId}));
      }
    }catch(err)
    {
      console.error("Error sending request");
    }


  };

  return (
    <div className="space-y-8">
      {/* nav-bar  */}
      <div className="flex justify-between items-center">
        <button className="flex gap-3 font-bold text-lg items-center">
          <ExternalLink />
          Links
        </button>
        <h1 className="text-2xl font-bold">Stay hungry; stay foolish.</h1>
        <div className="flex items-center gap-6">
          {/* ai */}
          <Ai onShowId={setSelectedId} />
          {!isLoggedIn && (
            <Link
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
              to="/authenticate"
            >
              <User className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-8 w-full h-auto">
        <div className="flex-1 h-100 flex flex-col gap-8">
          <div className="flex">
            <TimerComponent />
            <StudyStats />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            <NotesComponent />
            <TodoComponent />
          </div>
        </div>
        <Calender />
      </div>

      {/* Discussion Rooms */}
      <h1 className="text-2xl font-bold">Connect with friends</h1>
      <div className="grid grid-cols-3 gap-8">
        {["Room 1", "Room 2", "Room 3"].map((room) => (
          <div key={room} className="bg-gray-800 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">{room}</h3>
            <p className="text-gray-400 text-sm mb-4">4 students studying</p>
            <button className="bg-gray-700 hover:bg-purple-700 px-4 py-2 rounded-lg w-full flex gap-3 transition-all duration-200 ease-in-out">
              <Headphones />
              Join Room
            </button>
          </div>
        ))}
      </div>
      
      <h1 className="text-2xl font-bold">People</h1>
      <div className="relative h-[400px] mt-4 bg-black-800 rounded-lg">
        <div className="absolute inset-0 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            {
            otherUsers.length==0?
              (
                <p>No users found.</p>
              ):
              (
                otherUsers.map((person, index) => (
                  <div 
                    id={index} 
                    className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        {person.FullName?.charAt(0)}
                      </div>
                      <span className="text-lg">{person.FullName}</span>
                      {/* <div className="flex-1">
                        <h3 className="font-semibold text-sm">{person.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${
                            person.status === "online" ? "bg-green-400" : "bg-gray-400"
                          }`}></span>
                          <span className="text-xs text-gray-300">{person.status}</span>
                        </div>
                      </div> */}
                      <button onClick={() => handleRequest(person._id,index)} className="flex items-center gap-2 p-2 border rounded">
                        {status[index] === "pending" ? (
                          <Hourglass className="w-5 h-5 text-purple-400" />
                        ) : (
                          <UserPlus className="w-5 h-5 text-purple-400" />
                        )}
                      </button>
                    </div>
                    {/* <p className="text-xs text-gray-400">Studying: {person.studying}</p> */}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      
      

    </div>
  );
}

export default StudyRoom;
