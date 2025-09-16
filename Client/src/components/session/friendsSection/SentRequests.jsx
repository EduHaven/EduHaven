import { useSentRequests } from "@/queries/friendQueries";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SentRequests({ onBack }) {
  const { data: sentRequests = [] } = useSentRequests();

  const showSkeletons = sentRequests.length === 0;

  if (showSkeletons) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-gray-700/30 p-4 rounded-3xl shadow flex flex-col justify-center animate-pulse">
        <div className="w-full mb-4 h-8 bg-gray-500/20 rounded-md"></div>
        {Array(4)
          .fill()
          .map((key) => (
            <div
              key={key}
              className="flex justify-between items-center space-x-2 my-2"
            >
              <div className="w-10 aspect-square bg-gray-500/20 rounded-full"></div>
              <div className="flex-1 flex flex-col justify-center *:items-start space-y-2">
                <div className=" bg-gray-500/20 w-full h-4 rounded-md"></div>
                <div className=" bg-gray-500/20 w-8/12 h-2 rounded-md"></div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <section className="bg-sec rounded-3xl p-4">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2">
          <ArrowLeft className="w-5 h-5 txt" />
        </button>
        <h3 className="text-xl font-semibold txt">Sent Requests</h3>
      </div>
      {sentRequests.length === 0 ? (
        <p className="txt-dim">No sent requests.</p>
      ) : (
        <div className="space-y-4">
          {sentRequests?.map((user) => (
            <div key={user._id} className="flex items-center">
              <Link to={`/user/${user._id}`}>
                <img
                  src={
                    user?.ProfilePicture ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${user.FirstName}`
                  }
                  className="w-9 h-9 rounded-full transition hover:brightness-75 cursor-pointer"
                  alt="Profile"
                />
              </Link>
              <div className="ml-4">
                <Link
                  to={`/user/${user._id}`}
                  className="text-lg font-medium line-clamp-1 txt hover:underline"
                >
                  {user.FirstName
                    ? `${user.FirstName} ${user.LastName || ""}`
                    : "old-user"}
                </Link>
                <p className="text-sm txt-dim line-clamp-1">{user.Bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SentRequests;
