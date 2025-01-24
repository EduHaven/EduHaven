import Event from "../Model/EventModel.js";

export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEventByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, error: "Date query parameter is required." });
        }

        // Adjusting date format to match database entries (ignoring time part)
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find events within the day range
        const events = await Event.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (events.length === 0) {
            return res.status(404).json({ success: false, error: "No events found for the specified date." });
        }

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: "Event not found" });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, date, time } = req.body;

        // Validation
        if (!title || !date || !time) {
            return res.status(400).json({ success: false, error: "Title, date, and time are required." });
        }

        const newEvent = new Event({ title, date, time });
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, time } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, date, time },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ success: false, error: "Event not found" });
        }

        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ success: false, error: "Event not found" });
        }
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
