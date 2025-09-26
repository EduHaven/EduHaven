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
import UseSocketContext from "@/contexts/SocketContext";
import useSessionRoom from "@/hooks/useSessionRoom";
import { Button } from "@/components/ui/button";

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
        <Button
          onClick={toggleAudio}
          size="icon"
          variant={isAudioEnabled ? "default" : "secondary"}
          className={`${isAudioEnabled ? "bg-[#333537] px-3 text-white transition-all" : "bg-[#F9DEDC] hover:bg-[#E5CDCB] px-5 text-[#601410]"}`}
        >
          {isAudioEnabled ? (
            <Mic size={24} strokeWidth={1.4} />
          ) : (
            <MicOff size={24} strokeWidth={1.8} />
          )}
        </Button>

        <Button
          onClick={toggleVideo}
          size="icon"
          variant={isVideoEnabled ? "default" : "secondary"}
          className={`${isVideoEnabled ? "bg-[#333537] px-3.5 text-white transition-all" : "bg-[#F9DEDC] hover:bg-[#E5CDCB] px-5 text-[#601410]"}`}
        >
          {isVideoEnabled ? (
            <Video size={26} strokeWidth={1.4} />
          ) : (
            <VideoOff size={24} />
          )}
        </Button>

        <Button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          size="icon"
          variant={isScreenSharing ? "secondary" : "default"}
          className={`${isScreenSharing ? "bg-[#A8C7FA] text-black" : "bg-[#333537] text-white"} px-5`}
        >
          <MonitorUp size={26} strokeWidth={1.4} />
        </Button>

        <Button
          onClick={handleLeaveRoom}
          size="icon"
          variant="destructive"
          className="px-6 hover:opacity-80"
        >
          <Phone size={24} strokeWidth={1.4} className="rotate-[135deg]" />
        </Button>
      </div>

      <div className="flex items-center  w-[32%] justify-end">
        <Button
          onClick={() => {
            setShowChat(false);
            setShowInfo(!showInfo);
          }}
          size="default"
          variant="transparent"
          className="px-4 items-center rounded-full flex gap-2 text-white hover:bg-[#242424]"
        >
          <Info
            size={26}
            className={`${showInfo ? "fill-[#A8C7FA] text-black" : "text-white"}`}
          />
          {participants.length}
        </Button>
        <Button
          onClick={() => {
            setShowInfo(false);
            setShowChat(!showChat);
          }}
          size="icon"
          variant="transparent"
          className="px-6 py-3 rounded-full hover:bg-[#242424]"
        >
          <MessageSquare
            size={26}
            className={`${showChat ? "fill-[#A8C7FA] text-[#A8C7FA]" : "text-white"}`}
          />
        </Button>
      </div>
    </div>
  );
}

export default Controls;
