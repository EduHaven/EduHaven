import express from "express";
import { getAllTodos,getTodoById,createTodo ,updateTodo,deleteTodo} from "../Controller/TodoController.js";


const router = express.Router();
<<<<<<< HEAD


router.post("/todo",createTodo);
router.get("/todos",getAllTodos);
=======
router.post("/todo",createTodo);
router.get("/todo",getAllTodos);
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
router.get("/todo/:id",getTodoById);
router.put("/todo/:id",updateTodo);
router.delete("/todo/:id",deleteTodo);

export default router;