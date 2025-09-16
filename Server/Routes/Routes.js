import authRoutes from "./AuthRoutes.js";
import TodoRoutes from "./ToDoRoutes.js";
import NotesRoutes from "./NotesRoutes.js";
import EventRoutes from "./EventRoutes.js";
import StudySessionRoutes from "./StudySessionRoutes.js";
import SessionRoomRoutes from "./SessionRoomRoutes.js";
import FriendsRoutes from "./FriendsRoutes.js";
import UserRoutes from "./UserRoutes.js";

export function mountRoutes(app) {
  app.use("/auth", authRoutes);
  app.use("/todo", TodoRoutes);
  app.use("/note", NotesRoutes);
  app.use("/events", EventRoutes);
  app.use("/study-sessions", StudySessionRoutes);
  app.use("/session-room", SessionRoomRoutes);
  app.use("/friends", FriendsRoutes);
  app.use("/user", UserRoutes);
}
