import express from "express";
import { getAllTodos,getTodoById,createTodo ,updateTodo,deleteTodo} from "../Controller/TodoController.js";


const router = express.Router();
router.post("/todo",createTodo);
router.get("/todo",getAllTodos);
router.get("/todo/:id",getTodoById);
router.put("/todo/:id",updateTodo);
router.delete("/todo/:id",deleteTodo);

export default router;