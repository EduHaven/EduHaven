import Note from "../Model/NoteModel.js";

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, error: "Note not found" });
        }
        res.status(200).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        // Validation
        if (!title || !content) {
            return res.status(400).json({ success: false, error: "Title and content are required." });
        }

        const newNote = new Note({ title, content, tags });
        await newNote.save();
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        // Allow only specific fields to be updated
        const updateFields = {};
        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (tags) updateFields.tags = tags;

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ success: false, error: "Note not found" });
        }
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ success: false, error: "Note not found" });
        }
        res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
