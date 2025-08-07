import SessionRoom from "../Model/SessionModel.js";

export const getRoomLists = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await SessionRoom.find().sort({ createdAt: -1 }).lean();

    const myRooms = [];
    const otherRooms = [];
    for (const r of rooms) {
      (r.createdBy.toString() === userId.toString()
        ? myRooms
        : otherRooms
      ).push(r);
    }

    return res.json({ myRooms, otherRooms });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;
    if (!userId || !payload) return "invalid input";
    const newRoom = new SessionRoom({ ...payload, createdBy: userId });
    await newRoom.save();
    res.json(newRoom);
  } catch (e) {
    console.log(e);
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;

    const room = await SessionRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this room" });
    }

    await SessionRoom.deleteOne({ _id: roomId });
    return res.json({ success: true, message: "Room deleted" });
  } catch (err) {
    console.error("deleteRoom error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
