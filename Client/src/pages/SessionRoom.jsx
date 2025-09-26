import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSessionChat from "../hooks/useSessionChat.jsx";
import Controls from "../components/sessionRooms/Controls.jsx";
import ChatPannel from "@/components/sessionRooms/ChatPannel.jsx";
import ShowInfo from "@/components/sessionRooms/InfoPannel.jsx";
import UseSocketContext from "@/contexts/SocketContext.jsx";
import { UseMediaHandlers } from "@/hooks/WebRTC/UseMediaHandlers.jsx";
import UseConnectToSocketServer from "@/hooks/WebRTC/UseSocketService.jsx";
import VideoConferenceView from "@/hooks/WebRTC/VideoConferenceView.jsx";

function SessionRoom() {
  const { id: roomId } = useParams();
  const [showChat, setShowChat] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const { socket } = UseSocketContext();

  const socketIdRef = useRef();
  const videoRef = useRef([]);
  const [videos, setVideos] = useState([]);
  const localVideoref = useRef();

  const { messages, typingUsers, sendMessage, startTyping, stopTyping } =
    useSessionChat(socket, roomId);

  const {
    videoToggle,
    audioToggle,
    screen,
    handleVideo,
    handleAudio,
    handleScreen,
  } = UseMediaHandlers(localVideoref, socketIdRef, socket);

  UseConnectToSocketServer(socket, socketIdRef, roomId, videoRef, setVideos);
  if (videos) console.log("the list of videos are:", videos);

  if (!socket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="txt">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 bg-black relative">
          {/* Local Video */}
          {/* <div className="absolute top-4 right-4 w-48 h-32 bg-gray-800 rounded-lg overflow-hidden z-10">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
              You {isScreenSharing && "(Screen)"}
            </div>
          </div> */}

          {/* Remote Videos */}
          {/* <div className="grid grid-cols-2 gap-4 p-4 h-full">
            {Array.from(peers.values()).map((peer) => (
              <div
                key={peer.userId}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  ref={(el) => {
                    if (el && peer.stream) {
                      el.srcObject = peer.stream;
                    }
                  }}
                />
                <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                  {peer.userId}
                </div>
              </div>
            ))}
          </div> */}

          {/* No video message */}
          {/* {!isVideoEnabled && peers.size === 0 && !isScreenSharing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Video size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No video active</p>
                <p className="text-sm opacity-75">
                  Click the video button to start your camera
                </p>
              </div>
            </div>
          )} */}

          <video
            className={"bg-blue-500 h-[200px]"}
            ref={localVideoref}
            autoPlay
            muted
          ></video>

          <VideoConferenceView videos={videos} />
        </div>

        {showChat && (
          <ChatPannel
            messages={messages}
            typingUsers={typingUsers}
            sendMessage={sendMessage}
            startTyping={startTyping}
            stopTyping={stopTyping}
            setShowChat={setShowChat}
          />
        )}

        {showInfo && <ShowInfo setShowInfo={setShowInfo} />}
      </div>

      <Controls
        roomId={roomId}
        showChat={showChat}
        showInfo={showInfo}
        setShowChat={setShowChat}
        setShowInfo={setShowInfo}
        // pass WebRTC stuff:
        isAudioEnabled={audioToggle}
        isVideoEnabled={videoToggle}
        isScreenSharing={screen}
        toggleAudio={handleAudio}
        toggleVideo={handleVideo}
        startScreenShare={handleScreen}
        stopScreenShare={handleScreen}
      />
    </div>
  );
}

export default SessionRoom;
