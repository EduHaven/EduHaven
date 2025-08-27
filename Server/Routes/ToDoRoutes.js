import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  recreateDailyHabits,
  getTodoByUserId,
} from "../Controller/TodoController.js";
import authMiddleware from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all event routes
router.post(authMiddleware)

router.post("/", createTodo);
router.get("/", getAllTodos);
router.get("/:id",  getTodoById);
router.get("/user/:id", getTodoByUserId);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.post("/recreate-daily-habits", recreateDailyHabits);

export default router;
