import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    cateogery: {
      type: String,
      required: true,
      enum: [
        "study-room",
        "general",
        "Tech",
        "Science",
        "Language-learning",
        "Professional",
        "Career-development",
        "Industry-Deep-dives",
        "Entrepreneurship/startup",
        "marketing",
        "Side-Hustles",
        "Freelancing",
        "Hobbies",
        "fitness",
        "Art/design",
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SessionRoom = mongoose.model("Room", sessionSchema);
export default SessionRoom;
