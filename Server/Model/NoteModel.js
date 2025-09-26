import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "default",
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "archived", "trashed"],
      default: "active",
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        access: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("Note", noteSchema);
