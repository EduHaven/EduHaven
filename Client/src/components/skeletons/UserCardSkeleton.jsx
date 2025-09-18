const UserCardSkeleton = () => {
  return (
    <div className="flex-1 basis-[250px] max-w-sm p-3 rounded-3xl pt-4 bg-[var(--bg-sec)]">
      <div className="animate-pulse flex flex-col items-center text-center">
        {/* Avatar Placeholder */}
        <div className="w-24 h-24 rounded-full mb-3 bg-[var(--bg-primary)]"></div>

        {/* Name Placeholder */}
        <div className="h-4 w-3/4 rounded mb-2 bg-[var(--bg-primary)]"></div>

        {/* Secondary Text Placeholder */}
        <div className="h-3 w-1/2 rounded mb-4 bg-[var(--bg-primary)]"></div>

        {/* Button Placeholder */}
        <div className="h-10 w-full rounded-lg mt-2 bg-[var(--bg-primary)]"></div>
      </div>
    </div>
  );
};

export default UserCardSkeleton;
