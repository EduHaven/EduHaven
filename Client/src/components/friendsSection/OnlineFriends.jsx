import { User } from "lucide-react";
import { useState } from "react";
import UseSocketContext from "@/context/SocketContext";

function OnlineFriends() {
  const { onlineUsers } = UseSocketContext();

  const maxVisible = 8;
  const visibleUsers = onlineUsers.slice(0, maxVisible);
  const extraCount = onlineUsers.length - maxVisible;

  const rows = [visibleUsers.slice(0, 4), visibleUsers.slice(4, 8)];

  return (
    <section>
      {onlineUsers.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4 txt">Online users</h2>
          <div className="flex flex-col gap-3 w-[100%]">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-evenly flex-wrap ">
                {row.map((user, i) => {
                  const isLast = rowIndex === 1 && i === row.length - 1;
                  const showExtra = isLast && extraCount > 0;

                  return (
                    <div
                      key={user.id}
                      className="flex flex-col items-center mb-3 "
                    >
                      <div className="bg-sec rounded-full overflow-hidden size-14 flex items-center justify-center">
                        {showExtra ? (
                          <span className="text-sm font-bold text-white">
                            +{extraCount}
                          </span>
                        ) : (
                          <ProfileIcon profileImage={user.profileImage} />
                        )}
                      </div>
                      {!showExtra && (
                        <h4 className="mt-2 text-sm font-medium text-center txt line-clamp-1">
                          {user.name.split(" ")[0]}
                        </h4>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function ProfileIcon({ profileImage }) {
  const [error, setError] = useState(false);

  if (!profileImage || error) {
    return <User strokeWidth={0.9} className="w-8 h-8 text-white" />;
  }

  return (
    <img
      src={profileImage}
      alt="user"
      className="object-cover size-full rounded-full"
      onError={() => setError(true)}
    />
  );
}

export default OnlineFriends;
