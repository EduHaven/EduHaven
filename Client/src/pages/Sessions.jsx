import { useEffect, useState } from "react";
import OtherRoom from "../components/session/OtherRooms.jsx";
import OnlineFriends from "../components/friendsSection/OnlineFriends.jsx";
import FriendRequests from "../components/friendsSection/FriendsRequests.jsx";
import SuggestedFriends from "../components/friendsSection/SuggestedFriends.jsx";
import SentRequests from "../components/friendsSection/SentRequests.jsx";
import YourRooms from "@/components/session/YourRooms.jsx";
import NotLogedInPage from "@/components/NotLogedInPage.jsx";
import axios from "axios";

function Session() {
  const [view, setView] = useState("suggested");
  const token = localStorage.getItem("token");
  const [myRooms, setMyRooms] = useState([]);
  const [otherRooms, setOtherRooms] = useState([]);
  const backendUrl = import.meta.env.VITE_API_URL;
  if (!token) return <NotLogedInPage />;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/session-room`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyRooms(data.myRooms);
        setOtherRooms(data.otherRooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, [backendUrl, token]);

  return (
    <div className="h-[100vh] w-[calc(100vw-70px)] pb-0 flex ">
      <div className="w-[80%] overflow-x-hidden p-3 2xl:p-6 space-y-6">
        <YourRooms myRooms={myRooms} />
        <OtherRoom otherRooms={otherRooms} />
      </div>
      <aside className="w-[20%] overflow-scroll min-w-72 space-y-3 2xl:space-y-6 overflow-x-hidden p-3 2xl:p-6 border-l border-gray-500/20">
        <OnlineFriends />
        <FriendRequests />
        {view === "suggested" ? (
          <SuggestedFriends onViewSentRequests={() => setView("sent")} />
        ) : (
          <SentRequests onBack={() => setView("suggested")} />
        )}
      </aside>
    </div>
  );
}

export default Session;
