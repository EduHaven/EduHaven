import axiosInstance from "@/utils/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Edit, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from '@/components/ui/button';

const AllEventsPopup = ({ events, onClose, refreshEvents }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const eventsContainerRef = useRef(null);

  useEffect(() => {
    if (eventsContainerRef.current) {
      const today = new Date();
      const todayElement = eventsContainerRef.current.querySelector(
        `[data-date="${today.toISOString().split("T")[0]}"]`
      );
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [events]);

  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setEditTitle(event.title);
    setEditTime(event.time);
    setEditDate(event.date.split("T")[0]);
  };

  const handleSave = async () => {
    if (!editTitle || !editTitle.trim() || !editTime || !editDate) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await axiosInstance.put(`/events/${editingEvent}`, {
        title: editTitle,
        time: editTime,
        date: editDate,
      });
      setEditingEvent(null);
      refreshEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const convertTo12HourFormat = (timeString) => {
    const [hourString, minutes] = timeString.split(":");

    let hour = parseInt(hourString);

    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) {
      hour = 12; //12 AM
    } else if (hour > 12) {
      hour = hour - 12;
    }

    return `${hour}:${minutes} ${ampm}`;
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-96 max-h-[80vh] bg-sec rounded-3xl p-6 shadow-2xl border border-[var(--bg-ter)] overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold txt">All Events</h2>
            <Button
              onClick={onClose}
              variant="transparent"
              size="icon"
              className="txt-dim hover:txt transition"
            >
              <X size={24} />
            </Button>
          </div>

          <div
            ref={eventsContainerRef}
            className="max-h-[60vh] overflow-y-auto space-y-3"
          >
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => {
                const eventTime = convertTo12HourFormat(event.time);
                const eventDate = new Date(event.date);

                const isToday =
                  eventDate.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={event._id}
                    data-date={event.date.split("T")[0]}
                    className={`p-3 rounded-lg border ${isToday
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-[var(--bg-ter)]"
                      }`}
                  >
                    {editingEvent === event._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full rounded-lg bg-transparent border border-[var(--bg-ter)] px-3 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                          placeholder="Event title"
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="flex-1 rounded-lg bg-transparent border border-[var(--bg-ter)] px-3 py-2 txt focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                          />
                          <input
                            type="time"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="flex-1 rounded-lg bg-transparent border border-[var(--bg-ter)] px-3 py-2 txt focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSave}
                            variant="default"
                            size="default"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={handleCancel}
                            variant="secondary"
                            size="default"
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm txt-dim">
                              {eventDate.toLocaleDateString()}
                            </span>
                            {isToday && (
                              <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                          <div className="text-sm txt-dim mb-1">
                            {eventTime}
                          </div>
                          <span className="block txt font-medium">
                            {event.title}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEdit(event)}
                            variant="transparent"
                            size="icon"
                            className="p-2 txt-dim hover:text-blue-500 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(event._id)}
                            variant="transparent"
                            size="icon"
                            className="p-2 txt-dim hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="txt-dim">No events found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AllEventsPopup;
