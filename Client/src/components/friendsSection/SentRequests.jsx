import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";

function SentRequests({ onBack }) {
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/friends/sent-requests")
      .then((response) => {
        setSentRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sent requests:", error);
      });
  }, []);

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
          {sentRequests.map((user) => (
            <div key={user._id} className="flex items-center">
              <Link to={`/user/${user._id}`}>
                {user.ProfilePicture ? (
                  <img
                    src={user.ProfilePicture}
                    className="w-9 h-9 rounded-full transition hover:brightness-75 cursor-pointer"
                    alt="Profile"
                  />
                ) : (
                  <div className="p-2 bg-ter rounded-full transition hover:brightness-75 cursor-pointer">
                    <User className="w-7 h-7" />
                  </div>
                )}
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
