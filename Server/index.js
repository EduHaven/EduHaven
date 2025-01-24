import express from "express";
import { ConnectDB } from "./Database/Db.js";
import cors from "cors";
import UserRoutes from "./Routes/UserRoutes.js";
import TodoRoutes from "./Routes/ToDoRoutes.js";
import EventRoutes from './Routes/EventRoutes.js';
import NotesRoutes from "./Routes/NotesRoutes.js"
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();
const port = 3000; 

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies and credentials
};


// Middleware to handle JSON data
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: true }));


// Example route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", UserRoutes);
app.use("/",TodoRoutes);
app.use("/",NotesRoutes)
app.use("/",EventRoutes);

// Start the server
app.listen(port, () => {
    ConnectDB();
  console.log(`Server running at http://localhost:${port}`);
});
