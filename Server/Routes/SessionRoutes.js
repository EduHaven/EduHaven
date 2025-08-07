import express from "express";
import authMiddleware from "../Middlewares/authMiddleware.js";
import { createRoom, deleteRoom, getRoomLists } from "../Controller/SessionsController.js";

const router = express.Router();

router.get("/", authMiddleware, getRoomLists);
router.post("/", authMiddleware, createRoom);
router.delete("/:id", authMiddleware, deleteRoom);

export default router;
