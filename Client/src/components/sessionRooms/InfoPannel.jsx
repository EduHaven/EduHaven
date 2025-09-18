import UseSocketContext from "@/contexts/SocketContext.jsx";
import useSessionRoom from "@/hooks/useSessionRoom.jsx";
import { Check, Clipboard, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import ProfileIcon from "./ProfileIcon.jsx";

function ShowInfo({ setShowInfo }) {
  const [copied, setCopied] = useState(false);
  const meetingLink = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const { id: roomId } = useParams();
  const { socket } = UseSocketContext();

  const { participants } = useSessionRoom(socket, roomId);
  return (
    <div className="w-[363px] m-4 mb-0 rounded-3xl bg-sec flex flex-col">
      <div className="max-w-sm w-full p-5 py-4 font-sans">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium txt ">Session details</h2>
          <button
            className=" txt hover:txt-hover"
            onClick={() => setShowInfo(false)}
          >
            <X size={22} />
          </button>
        </div>
        <div className="text-sm font-medium txt mb-2">Joining info</div>
        <p className="text-sm txt-dim mb-3 break-all">{meetingLink}</p>

        <button
          onClick={handleCopy}
          className="flex items-center text-blue-400 hover:bg-[var(--bg-ter)] px-3 py-2 rounded-full text-sm font-medium"
        >
          {copied ? (
            <Check size={18} className="mr-1.5" />
          ) : (
            <Clipboard size={18} className="mr-1.5" />
          )}
          {copied ? "Copied" : "Copy joining info"}
        </button>
      </div>

      <div className="p-4 py-3 border-t border-gray-500/20">
        <div className="flex items-center justify-between mr-4">
          <h3 className="font-semibold txt mb-3">Participants</h3>
          <h3 className="font-semibold txt mb-3">{participants.length}</h3>
        </div>
        <div className="space-y-3 px-1">
          {participants.map((participant) => (
            <div className="flex gap-4 items-center" key={participant.userId}>
              <ProfileIcon profileImage={participant.profileImage} />
              <span className="txt">{participant.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowInfo;
