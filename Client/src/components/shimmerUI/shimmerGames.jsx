const GameRoomShimmer = () => {
  return (
    <div>
      {/* Navbar Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-700 shimmer-glow rounded-lg"></div>
        <div className="h-10 w-32 bg-gray-700 shimmer-glow rounded-lg"></div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="w-[svw] h-[50vh] pb-5 relative">
        <div className="flex flex-col justify-center h-full">
          <div className="h-12 w-[40%] bg-gray-700 shimmer-glow rounded-lg mx-28 mb-3"></div>
          <div className="h-10 w-[35%] bg-gray-600 shimmer-glow rounded-lg mx-28"></div>
        </div>
      </div>

      {/* Games Section Skeleton (Fixed Size) */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
        {[1, 2, 3, 4].map((id) => (
          <div
            key={id}
            className="bg-gray-700 flex gap-3 p-6 rounded-xl shimmer-glow shimmer-box"
          >
            <div className="h-24 w-24 bg-gray-600 shimmer-glow rounded-md"></div>
            <div className="flex flex-col flex-1 justify-center p-4 h-[130px]">
              <div className="h-6 w-32 bg-gray-600 shimmer-glow rounded-md mb-2"></div>
              <div className="h-4 w-24 bg-gray-600 shimmer-glow rounded-md mb-2"></div>
              <div className="h-6 w-16 bg-gray-600 shimmer-glow rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Breathing Space */}
      <div className="h-[200px]"></div>
    </div>
  );
};

export default GameRoomShimmer;



  