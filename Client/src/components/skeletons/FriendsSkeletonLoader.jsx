import UserCardSkeleton from "./UserCardSkeleton";
import { Loader2Icon } from "lucide-react";

const FriendsSkeletonLoader = ({ count = 12 }) => {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 2xl:gap-4 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
      <div className="mx-auto w-fit">
        <Loader2Icon
          size={50}
          className="mt-10 animate-spin text-[var(--bg-sec)]"
        />
      </div>
    </>
  );
};

export default FriendsSkeletonLoader;
