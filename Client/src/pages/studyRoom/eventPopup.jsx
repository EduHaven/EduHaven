import React, { useState, useEffect } from "react";
import axios from "axios";

const EventPopup = ({ date, onClose, refreshEvents }) => {
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log(date);
        const response = await axios.get(
          `http://localhost:3000/events-by-date?date=${date}`
        );
        const eventData = response.data.data[0]; // Assuming one event per date
        setId(eventData._id);
        console.log(response);
        if (eventData) {
          setEvent(eventData);
          setTitle(eventData.title || "");
          setTime(eventData.time || "");

          console.log("event exists", eventData);
        } else {
          setEvent(null);
          setTitle("");
          setTime("");
          console.log("No set event", date);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [date]);

  const handleCreateOrUpdate = async () => {
    try {
      const eventData = {
        title,
        time,
        date,
      };

      if (id) {
        // Update event if `id` exists
        await axios.put(`http://localhost:3000/events/${id}`, eventData);
        console.log("Event updated successfully");
      } else {
        // Create a new event if `id` is not provided
        await axios.post("http://localhost:3000/events", eventData);
        console.log("Event created successfully");
      }

      refreshEvents(); // Refresh calendar events
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axios.delete(`http://localhost:3000/events/${id}`);
        console.log("deleted");
        refreshEvents();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">
          {event ? `Edit Event on ${date}` : `Create Event on ${date}`}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Event Title:</label>
          <input
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded p-2 focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Event Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded p-2 focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleCreateOrUpdate}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
          >
            {event ? "Update" : "Create"}
          </button>
          {event && (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-500 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
