import UseSocketContext from "@/contexts/SocketContext.jsx";
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
      <h2 className="font-semibold txt whitespace-nowrap">
        {`${onlineUsers.length} online`}
      </h2>
    </div>
  );
}

function ProfileImage({ src }) {
  const [error, setError] = useState(false);

  return (
    <div className="border-4 -ml-4 border-[var(--bg-primary)] rounded-full overflow-hidden size-8">
      {error || !src ? (
        <div className="flex items-center justify-center size-full bg-ter">
          <User className="w-4 h-4 text-white" />
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
