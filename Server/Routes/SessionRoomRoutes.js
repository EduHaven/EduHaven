import express from "express";
import authMiddleware from "../Middlewares/authMiddleware.js";
import {
  createRoom,
  deleteRoom,
  getRoomLists,
  requestJoinRoom,
  handleJoinRequest,
  joinRoom,
  getJoinStatus,
} from "../Controller/SessionRoomController.js";
// Get current user's join status for a room

const router = express.Router();


router.get("/", authMiddleware, getRoomLists);
router.post("/", authMiddleware, createRoom);
router.delete("/:id", authMiddleware, deleteRoom);

// Join request for private room
router.post("/:id/request-join", authMiddleware, requestJoinRoom);
// Approve/reject join request (room creator)
router.post("/:id/handle-request", authMiddleware, handleJoinRequest);
// Join a room (public or if member)
router.post("/:id/join", authMiddleware, joinRoom);

router.get("/:id/join-status", authMiddleware, getJoinStatus);
export default router;
