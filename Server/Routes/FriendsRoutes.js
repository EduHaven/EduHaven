import express from "express";
import {
  friendList,
  userList,
  sendRequest,
  incomingRequests,
  acceptRequest,
  rejectRequest,
  viewSentRequests,
  removeFriend,
  getFriendsCount,
  getUserStats,
  removeSentRequest
} from "../Controller/FriendsController.js";

import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, friendList);
router.get("/friend-suggestions", authMiddleware, userList);
router.post("/request/:friendId", authMiddleware, sendRequest);
router.get("/sent-requests", authMiddleware, viewSentRequests);
router.get("/requests", authMiddleware, incomingRequests);
router.post("/accept/:friendId", authMiddleware, acceptRequest);
router.delete("/reject/:friendId", authMiddleware, rejectRequest);
router.delete("/:friendId", authMiddleware, removeFriend);
router.get("/count", authMiddleware, getFriendsCount);
router.get("/:userId/stats", authMiddleware, getUserStats);
router.delete("/sent-requests/:friendId", authMiddleware, removeSentRequest);

export default router;
