// Get current user's join status for a room
export const getJoinStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;
    const room = await SessionRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    // Compare as strings for safety
    const isMember = room.members
      .map((id) => id.toString())
      .includes(userId.toString());
    const isPending = room.pendingRequests
      .map((id) => id.toString())
      .includes(userId.toString());
    let status = "none";
    if (isMember) status = "member";
    else if (isPending) status = "pending";
    return res.json({ status });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};
import SessionRoom from "../Model/SessionModel.js";

export const getRoomLists = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const rooms = await SessionRoom.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "pendingRequests",
        select: "Username ProfilePicture Bio OtherDetails",
      })
      .lean();


    const myRooms = [];
    const otherRooms = [];
    const joinedRooms = [];
    
    for (const r of rooms) {
      const isCreator = r.createdBy.toString() === userId.toString();
      const isMember = r.members.some(memberId => memberId.toString() === userId.toString());
      
      if (isCreator) {
        myRooms.push(r);
      } else if (isMember) {
        joinedRooms.push(r);
      } else {
        otherRooms.push(r);
      }
    }

    return res.json({ myRooms, otherRooms, joinedRooms });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = req.body;
    if (!userId || !payload)
      return res.status(400).json({ error: "invalid input" });
    // If private, add creator as member
    const isPrivate = payload.isPrivate || false;
    const members = isPrivate ? [userId] : [];
    const newRoom = new SessionRoom({ ...payload, createdBy: userId, members });
    await newRoom.save();
    res.json(newRoom);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Request to join a private room
export const requestJoinRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;
    const room = await SessionRoom.findById(roomId);
    if (!room) {
      console.log(`[JoinRequest] Room not found: ${roomId}`);
      return res.status(404).json({ error: "Room not found" });
    }
    if (!room.isPrivate) {
      console.log(`[JoinRequest] Room is public: ${roomId}`);
      return res
        .status(400)
        .json({ error: "Room is public, just join directly." });
    }
    if (room.members.includes(userId)) {
      console.log(
        `[JoinRequest] Already a member: user ${userId} room ${roomId}`
      );
      return res.status(400).json({ error: "Already a member." });
    }
    if (room.pendingRequests.includes(userId)) {
      console.log(
        `[JoinRequest] Request already sent: user ${userId} room ${roomId}`
      );
      return res.status(400).json({ error: "Request already sent." });
    }
    room.pendingRequests.push(userId);
    await room.save();
    res.json({ success: true, message: "Request sent." });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Cancel a pending join request for a private room
export const cancelJoinRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;
    const room = await SessionRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    // Only meaningful for private rooms
    if (!room.isPrivate)
      return res.status(400).json({ error: "Room is public" });
    const wasPending = room.pendingRequests
      .map((id) => id.toString())
      .includes(userId.toString());
    if (!wasPending) {
      return res.status(400).json({ error: "No pending request to cancel" });
    }
    room.pendingRequests = room.pendingRequests.filter(
      (id) => id.toString() !== userId.toString()
    );
    await room.save();
    return res.json({ success: true, message: "Request canceled." });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Approve or reject join request (room creator only)
export const handleJoinRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;
    const { targetUserId, action } = req.body; // action: 'approve' or 'reject'
    const room = await SessionRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.createdBy.toString() !== userId.toString())
      return res.status(403).json({ error: "Not authorized" });
    if (!room.pendingRequests.includes(targetUserId))
      return res.status(400).json({ error: "No such request" });
    if (action === "approve") {
      room.members.push(targetUserId);
    }
    // Remove from pending in both approve/reject
    room.pendingRequests = room.pendingRequests.filter(
      (id) => id.toString() !== targetUserId.toString()
    );
    await room.save();
    res.json({ success: true, message: `Request ${action}d.` });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Join a public room or a private room if member
export const joinRoom = async (req, res) => {
  try {
    const userId = req.user._id;
    const roomId = req.params.id;
    const room = await SessionRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    if (room.isPrivate) {
      if (!room.members.includes(userId)) {
        return res
          .status(403)
          .json({ error: "Not a member of this private room." });
      }
    }
    // Optionally add to members if not already present (for public rooms)
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }
    res.json({ success: true, message: "Joined room." });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
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
