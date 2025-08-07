import { User } from "lucide-react";
import { useState } from "react";

function ProfileIcon({ profileImage, size = 9 }) {
  const [error, setError] = useState(false);

  if (!profileImage || error) {
    return (
      <User strokeWidth={0.9} className="w-8 h-8 txt bg-primary rounded-full p-0.5" />
    );
  }

  return (
    <img
      src={profileImage}
      alt="user"
      className={`object-cover w-${size} h-${size} rounded-full`}
      onError={() => setError(true)}
    />
  );
}
export default ProfileIcon;
