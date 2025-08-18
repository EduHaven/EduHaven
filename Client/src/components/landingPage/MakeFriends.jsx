function MakeFriends() {
  return (
    <div className="max-w-3xl xl:max-w-7xl  mx-auto mb-28 flex gap-4 xl:gap-24 items-center justify-center">
      <h1 className="flex-1 text-right max-w-[400px] text-2xl xl:text-3xl font-poppins font-thin leading-[1.5] min-h-[calc(1.5em*4)] text-balance">
        Add friends, create study groups, track insights and progress together.
      </h1>

      <div className="flex-1 max-w-[700px] relative rounded-3xl bg-re d-100 z-50 aspect-video">
        <img
          src="/leaderboard.webp"
          alt="Friends Chat"
          className="absolute bottom-[40%] right-[10%] w-[30%] rounded-2xl shadow-2xl object-cover"
        />
        <img
          src="/userProfile.webp"
          alt="Study Room"
          className="absolute top-0 left-0 h-[90%] rounded-2xl shadow-2xl object-cover"
        />
        <img
          src="/studyStats.webp"
          alt="Group Study"
          className="absolute bottom-0 right-0 w-[80%] rounded-2xl shadow-2xl object-cover"
        />
      </div>
    </div>
  );
}

export default MakeFriends;
