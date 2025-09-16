import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const EventPopup = ({ date, onClose, refreshEvents }) => {
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [id, setId] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(
          `/events/by-date?date=${date}`
        );

        const eventData = response.data.data[0]; // Assuming one event per date
        if (eventData) {
          setId(eventData._id);
          setEvent(eventData);
          setTitle(eventData.title || "");
          setTime(eventData.time || "08:00");
        } else {
          setEvent(null);
          setTitle("");
          setTime("08:00");
        }
      } catch (error) {
        // Handle case where no events found (404 is expected)
        if (error.response?.status === 404) {
          setEvent(null);
          setTitle("");
          setTime("08:00");
        } else {
          console.error("Error fetching event:", error);
          // Handle unauthorized access
          if (error.response?.status === 401) {
            console.error("Unauthorized: Please log in again");
          }
        }
      }
    };

    fetchEvent();
  }, [date]);

  const handleCreateOrUpdate = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      const eventData = { title, time, date };

      if (id) {
        await axiosInstance.put(`/events/${id}`, eventData);
      } else {
        await axiosInstance.post(`/events`, eventData);
      }

      refreshEvents();
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      // Handle unauthorized access
      if (error.response?.status === 401) {
        console.error("Unauthorized: Please log in again");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await axiosInstance.delete(`/events/${id}`);
        refreshEvents();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle unauthorized access
      if (error.response?.status === 401) {
        console.error("Unauthorized: Please log in again");
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-96 bg-sec rounded-3xl p-8 shadow-2xl shadow-gray-900 border border-[var(--bg-ter)]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold txt">
                {event ? "Edit Event" : "New Event"}
              </h2>
              <p className="text-sm txt-dim">{date}</p>
            </div>
            <Button
              onClick={onClose}
              variant="transparent"
              size="icon"
              className="txt-dim hover:txt transition mb-auto"
            >
              <X size={24} />
            </Button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-[var(--bg-ter)] px-4 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="mb-6">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl bg-transparent border border-[var(--bg-ter)] px-4 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="flex space-x-3">
            {event && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="default"
                className="flex-1 text-center txt font-semibold shadow"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={handleCreateOrUpdate}
              variant="default"
              size="default"
              className="flex-1 m-auto w-min text-center font-semibold shadow"
            >
              {event ? "Update" : "Create"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventPopup;
