import express from "express";
import { 
    getAllNotes, 
    getNoteById, 
    createNote, 
    updateNote, 
    deleteNote 
} from "../Controller/NotesController.js";

const router = express.Router();

// Route to create a new note
router.post("/note", createNote);

// Route to get all notes
router.get("/note", getAllNotes);

// Route to get a specific note by its ID
router.get("/note/:id", getNoteById);

// Route to update a specific note by its ID
router.put("/note/:id", updateNote);

// Route to delete a specific note by its ID
router.delete("/note/:id", deleteNote);

export default router;
