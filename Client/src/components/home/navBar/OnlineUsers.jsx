import UseSocketContext from "@/context/SocketContext.jsx";
import { User } from "lucide-react";
import { useState } from "react";

export default function OnlineUsers() {
  const { onlineUsers } = UseSocketContext();

  return (
    <div className="flex items-center gap-1">
      {onlineUsers.length > 0 && (
        <div className="flex">
          {onlineUsers.slice(0, 4).map(({ id, profileImage }) => (
            <ProfileImage key={id} src={profileImage} />
          ))}
        </div>
      )}
      <h2 className="font-semibold txt text-sm sm:text-base">
        <span className="hidden sm:inline">{onlineUsers.length} online</span>
        <span className="sm:hidden">{onlineUsers.length}</span>
      </h2>
    </div>
  );
}

function ProfileImage({ src }) {
  const [error, setError] = useState(false);

  return (
    <div className="border-2 sm:border-4 -ml-2 sm:-ml-4 border-[var(--bg-primary)] rounded-full overflow-hidden size-6 sm:size-8">
      {error || !src ? (
        <div className="flex items-center justify-center size-full bg-ter">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
      ) : (
        <img
          src={src}
          alt="User"
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
