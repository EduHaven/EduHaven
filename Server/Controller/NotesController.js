import Note from "../Model/NoteModel.js";
import { v2 as cloudinary } from "cloudinary";
import { removefromCloudinary } from "../utils/Cloudnary.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmehndmws",
  api_key: process.env.CLOUDINARY_API_KEY || "772976768998728",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "BXpWyZHYKbAexc3conUG88t6TVM",
});

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Clean up trashed notes older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Note.deleteMany({
      status: "trashed",
      trashedAt: { $lte: thirtyDaysAgo },
    });

    // 🔹 Fetch only active notes (exclude archive & trash)
    const notes = await Note.find({
      status: "active",
      $or: [
        { owner: userId },
        { "collaborators.user": userId },
        { visibility: "public" },
      ],
    }).sort({ pinnedAt: -1, updatedAt: -1 });

    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (
      !note ||
      (note.visibility !== "public" &&
        note.owner.toString() !== userId.toString() &&
        !note.collaborators.some(
          (c) => c.user.toString() === userId.toString()
        ))
    ) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { title, content, color, visibility, collaborators } = req.body;
    const userId = req.user._id;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Title and content are required." });
    }

    const newNote = new Note({
      title,
      content,
      color: color || "default",
      visibility: visibility || "private",
      collaborators: collaborators || [],
      owner: userId,
    });

    await newNote.save();
    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { title, content, color, visibility, collaborators, pinnedAt } =
      req.body;

    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    const isOwner = note.owner.toString() === userId.toString();
    const isEditor = note.collaborators.some(
      (c) => c.user.toString() === userId.toString() && c.access === "edit"
    );

    if (!isOwner && !isEditor) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (color) note.color = color;
    if (visibility) note.visibility = visibility;
    if (pinnedAt === true) {
      note.pinnedAt = new Date();
    } else if (pinnedAt === false) {
      note.pinnedAt = null;
    }
    if (isOwner && collaborators) {
      note.collaborators = collaborators;
    }

    const updatedNote = await note.save();

    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    if (note.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    await note.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const uploadNoteImage = async (req, res) => {
  console.log("Upload Note Image called");
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Please log in" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    if (!req.file.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ error: "Invalid file type. Only images allowed." });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
      return res
        .status(400)
        .json({ error: "File too large. Max 5MB allowed." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "eduhaven-notes",
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Resize and limit image size
        { quality: "auto" }, // Optimize image quality
      ],
    });

    return res.status(200).json({
      message: "Note image uploaded successfully",
      noteImageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Note image upload error:", error);
    return res.status(500).json({
      error: "Failed to upload note image",
      details: error.message,
    });
  }
};

export const getArchivedNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const notes = await Note.find({
      status: "archived",
      owner: userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const archiveNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note || note.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    if (note.status == "archived") {
      note.status = "active";
    } else if (note.status == "active") {
      note.status = "archived";
    }

    note.trashedAt = null; // reset if it was in trash before
    await note.save();

    res
      .status(200)
      .json({ success: true, message: "Note archived", data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTrashedNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const notes = await Note.find({
      status: "trashed",
      owner: userId,
    }).sort({ trashedAt: -1 });

    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const moveToTrash = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note || note.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    note.status = "trashed";
    note.trashedAt = new Date();
    await note.save();

    res
      .status(200)
      .json({ success: true, message: "Note moved to trash", data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const restoreNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const note = await Note.findById(req.params.id);

    if (!note || note.owner.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Not authorized" });
    }

    note.status = "active";
    note.trashedAt = null;
    await note.save();

    res
      .status(200)
      .json({ success: true, message: "Note restored", data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const deleteNoteImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Please log in" });
    }
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ error: "No image specified" });
    }
    await removefromCloudinary(publicId, "image");
    return res
      .status(200)
      .json({ message: "Note image deleted successfully" });
  } catch (error) {
    console.error("Note image deletion error:", error);
    return res.status(500).json({
      error: "Failed to delete note image",
      details: error.message,
    });
  }
};

