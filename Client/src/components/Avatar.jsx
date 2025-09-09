import { User } from "lucide-react";
import { useState } from "react";

const Avatar = ({ src, alt }) => {
  const [error, setError] = useState(false);

  return src && !error ? (
    <img
      src={src}
      onError={() => setError(true)}
      className="w-12 aspect-square rounded-full transition hover:brightness-75 cursor-pointer"
      alt={alt}
    />
  ) : (
    <div className="p-2.5 bg-ter rounded-full transition hover:brightness-75 cursor-pointer">
      <User className="w-7 h-7" />
    </div>
  );
};

export default Avatar;
