import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  date: { type: Date, default: Date.now, index: { expires: "15552000s" } }, // 5 months
});

const TimerSession = mongoose.model("TimerSession", studySessionSchema);
export default TimerSession;
