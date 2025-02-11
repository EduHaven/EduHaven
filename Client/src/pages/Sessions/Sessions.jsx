import { useState, useEffect } from "react";
import { Users, PlusCircle, Activity } from "lucide-react";
import CreateRoomModal from "./CreateRoomModal";
import Friends from "./Friends";
import SessionShimmer from "../../components/shimmerUI/shimmerSession";

function Session() {
  const [Sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      setSessions([
        { id: 1, name: "Room 1", students: 4 },
        { id: 2, name: "Room 2", students: 4 },
        { id: 3, name: "Room 3", students: 4 },
      ]);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = (newRoomName) => {
    const newRoom = {
      id: Sessions.length + 1,
      name: newRoomName,
      students: 0,
    };
    setSessions([...Sessions, newRoom]);
  };

  return (
    <>
      {loading ? (
        <SessionShimmer />
      ) : (
        <>
          {/* Navbar */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Study Room</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-6 h-6" />
              Create Your Own Room
            </button>
          </div>

          {/* Study Rooms Section */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Sessions.map((room) => (
                <div
                  key={room.id}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow shimmer-box"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <Users className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-gray-400 mb-4">
                    <span className="font-medium">{room.students}</span> student
                    {room.students !== 1 ? "s" : ""} studying
                  </p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Activity className="w-5 h-5" />
                    Join
                  </button>
                </div>
              ))}
            </div>
          </section>

          <br />
          <br />
          <hr />
          <br />

          <Friends friendRequests={[]} suggestedFriends={[]} />

          <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateRoom} />
        </>
      )}
    </>
  );
}

export default Session;



