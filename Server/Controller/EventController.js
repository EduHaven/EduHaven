import Event from "../Model/EventModel.js";

// Helper for consistent error responses
const handleError = (res, error, statusCode = 500) => {
  console.error(`❌ Error: ${error.message}`);
  res.status(statusCode).json({ success: false, error: error.message });
};

// Ensure event belongs to authenticated user
const findUserEvent = async (id, userId) =>
  Event.findOne({ _id: id, createdBy: userId });

export const getAllEvents = async (req, res) => {
  try {
    // Migrate missing createdBy fields
    await Event.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: req.user._id } }
    );

    const events = await Event.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    handleError(res, error);
  }
};

export const getEventByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res
        .status(400)
        .json({ success: false, error: "Date query parameter is required." });
    }

    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await Event.find({
      createdBy: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No events found for the specified date.",
      });
    }

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    handleError(res, error);
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await findUserEvent(req.params.id, req.user._id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    handleError(res, error);
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, date, time } = req.body;
    if (!title || !date || !time) {
      return res
        .status(400)
        .json({ success: false, error: "Title, date, and time are required." });
    }

    const newEvent = await Event.create({
      title,
      date,
      time,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time } = req.body;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, date, time },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ success: false, error: "Event not found or unauthorized" });
    }

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await findUserEvent(req.params.id, req.user._id);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ success: false, error: "Event not found or unauthorized" });
    }

    await deletedEvent.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
