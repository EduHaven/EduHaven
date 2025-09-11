import { MessageCircle, Video } from "lucide-react";

function StudyRoom() {
  return (
    <div className="max-w-3xl xl:max-w-7xl mx-auto mb-28 md:flex gap-4 xl:gap-24 items-center justify-center">
      <div className="flex-1 md:max-w-[600px] w-[85%] relative rounded-3xl overflow-hidden shadow-2xl group md:ms-0 ms-[32px] md:mb-0 mb-[50px]">
        <div
          className="aspect-video relative bg-cover bg-center"
          style={{
            backgroundImage: `url('/studyRoom.png')`,
          }}
        >
          {/* Mock macOS window controls */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          {/* Floating chat bubbles */}
          <div className="absolute top-[12%] right-8 bg-white rounded-lg xl:rounded-2xl p-1.5 xl:p-3 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center space-x-2">
              <MessageCircle size={16} style={{ color: "var(--btn)" }} />
              <span className="text-xs" style={{ color: "black" }}>
                Need help with calculus?
              </span>
            </div>
          </div>

          <div className="absolute bottom-[12%] left-8 bg-white rounded-lg xl:rounded-2xl p-1.5 xl:p-3 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="flex items-center space-x-2">
              <Video size={16} style={{ color: "var(--btn)" }} />
              <span className="text-xs" style={{ color: "black" }}>
                Let us start a study group!
              </span>
            </div>
          </div>
        </div>
      </div>
      <h1 className="flex-1 max-w-[400px] text-balance text-xl sm:text-2xl xl:text-3xl font-poppins font-thin leading-[1.5] min-h-[calc(1.5em*4)] text-center xl:text-left">
        Connect with like-minded people, share knowledge build connections
      </h1>
    </div>
  );
}

export default StudyRoom;
