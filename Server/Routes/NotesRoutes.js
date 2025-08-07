import express from "express";
import { 
    getAllNotes, 
    getNoteById, 
    createNote, 
    updateNote, 
    deleteNote 
} from "../Controller/NotesController.js";

import authMiddleware from '../Middlewares/authMiddleware.js';


const router = express.Router();

// Route to create a new note
router.post("/",authMiddleware, createNote);

// Route to get all notes
router.get("/",authMiddleware, getAllNotes);

// Route to get a specific note by its ID
router.get("/:id", authMiddleware,getNoteById);

// Route to update a specific note by its ID
router.put("/:id",authMiddleware, updateNote);

// Route to delete a specific note by its ID
router.delete("/:id",authMiddleware, deleteNote);

export default router;
