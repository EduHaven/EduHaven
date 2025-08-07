import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Info,
  Phone,
  MonitorUp,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import useSessionChat from "../../hooks/useSessionChat";
// import UseSocket from "@/hooks/UseSocket";
import { useEffect, useState } from "react";
import UseSocketContext from "@/context/SocketContext";
import useSessionRoom from "@/hooks/useSessionRoom";

function Controls({
  roomId,
  setShowChat,
  setShowInfo,
  showInfo,
  showChat,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  toggleAudio,
  toggleVideo,
  startScreenShare,
  stopScreenShare,
}) {
  const navigate = useNavigate();
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate("/session");
  };
  const { socket, isConnected } = UseSocketContext();
  const { participants, leaveRoom } = useSessionRoom(socket, roomId);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      const formattedTime = `${hours}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;
      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2.5 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2 ml-4 w-[32%]">
        <h2 className="font-semibold text-lg">{time}</h2>
        <p className="text-neutral-400">|</p>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 mt-0.5 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-neutral-300">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/*Controls */}
      <div className="flex items-center gap-2 w-[32%] justify-center ">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${
            isAudioEnabled
              ? "bg-[#333537] px-3.5 transition-all text-white "
              : "bg-[#F9DEDC] hover:bg-[#E5CDCB] px-5 text-[#601410]"
          }`}
        >
          {isAudioEnabled ? (
            <Mic size={24} strokeWidth={1.4} />
          ) : (
            <MicOff size={24} strokeWidth={1.8} />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoEnabled
              ? "bg-[#333537] px-3.5 transition-all text-white"
              : "bg-[#F9DEDC] hover:bg-[#E5CDCB] px-5 text-[#601410]"
          }`}
        >
          {isVideoEnabled ? (
            <Video size={26} strokeWidth={1.4} />
          ) : (
            <VideoOff size={24} />
          )}
        </button>

        <button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={`p-3 px-5 rounded-full ${
            isScreenSharing
              ? "bg-[#A8C7FA] text-black"
              : "bg-[#333537] text-white"
          }`}
        >
          <MonitorUp size={26} strokeWidth={1.4} />
        </button>

        <button
          onClick={handleLeaveRoom}
          className="p-3 px-6 rounded-full bg-[#DC362E] hover:bg-red-500 text-white hover:opacity-80"
        >
          <Phone size={24} strokeWidth={1.4} className="rotate-[135deg]" />
        </button>
      </div>

      <div className="flex items-center  w-[32%] justify-end">
        <button
          onClick={() => {
            setShowChat(false);
            setShowInfo(!showInfo);
          }}
          className={`px-4 items-center rounded-full hover:bg-[#242424] flex gap-2 text-white`}
        >
          <Info
            size={26}
            className={`${
              showInfo
                ? "fill-[#A8C7FA] text-black size-7 my-2.5"
                : "Show Chat my-3"
            }`}
          />
          {participants.length}
        </button>
        <button
          onClick={() => {
            setShowInfo(false);
            setShowChat(!showChat);
          }}
          className={`px-6 py-3 rounded-full hover:bg-[#242424] `}
        >
          <MessageSquare
            size={26}
            className={`${
              showChat ? "fill-[#A8C7FA] text-[#A8C7FA]" : "Show Chat"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default Controls;
