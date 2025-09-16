// components/ProfileCard/ProfileHeader.jsx
import { Edit3, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileHeader = ({
  isCurrentUser,
  user,
  profilelink,
  showLink,
  toggleLink,
  copyLink,
  shareRef,
}) => {
  return (
    <div className="flex justify-end gap-6 px-4">
      {isCurrentUser && (
        <Link to={"/settings/"}>
          <Edit3 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </Link>
      )}

      {user?._id && (
        <div className="relative inline-block">
          <Share2
            className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            onClick={toggleLink}
          />

          {showLink && (
            <div
              ref={shareRef}
              className="absolute top-full mt-2 right-0 flex items-center bg-[#1f2937] rounded-lg px-3 py-2 shadow-md border border-gray-700 w-64 z-20"
            >
              <input
                type="text"
                value={profilelink}
                readOnly
                title={profilelink}
                className="flex-1 bg-transparent text-sm text-white outline-none truncate"
              />
              <button
                className="ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-white transition"
                onClick={copyLink}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
