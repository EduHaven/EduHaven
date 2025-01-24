import express from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventByDate
} from "../Controller/EventController.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.get("/events-by-date", getEventByDate);
router.post("/events", createEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

export default router;
