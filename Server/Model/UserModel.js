import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String },
    Email: { type: String, required: true, unique: true },
    // I have modified password required so the user logging with google don't needs it.
    Password: {
      type: String,
      required: function () {
        return this.oauthProvider ? false : true;
      },
    },
    Username: { type: String, unique: true, required: true },
    oauthProvider: { type: String }, // e.g., "google", "github"
    oauthId: { type: String },

    ProfilePicture: { type: String, default: "" },
    Bio: { type: String, maxlength: 500 },
    Gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    University: { type: String },
    Country: { type: String },
    FieldOfStudy: { type: String },
    GraduationYear: { type: Number, min: 1900, max: 2100 },
    OtherDetails: { type: mongoose.Schema.Types.Mixed },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    kudosGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    kudosReceived: { type: Number, default: 0 },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    streaks: {
      current: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      lastStudyDate: { type: Date },
    },
    SessionRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SessionRoom",
      },
    ],
    badges: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String },
        icon: { type: String },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    // Ephemeral fields for secure destructive actions (e.g., account deletion)
    deletionOTP: {
      code: { type: String },
      expiresAt: { type: Date },
      verified: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", UserSchema);
export default User;
