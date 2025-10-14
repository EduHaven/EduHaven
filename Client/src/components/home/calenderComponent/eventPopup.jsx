import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import PopupContainer from "@/components/ui/Popup";

const EventPopup = ({ date, onClose, refreshEvents }) => {
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00");
  const [id, setId] = useState("");
  const { toast } = useToast();

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
    <PopupContainer
      title={event ? "Edit Event " : "New Event "}
      onClose={onClose}
    >
      <p className="text-sm txt-dim mb-6 -mt-5">{date}</p>
      <p className="txt-dim mb-2">Title of the event</p>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl bg-transparent border border-[var(--bg-ter)] px-4 py-2 txt placeholder:txt-dim focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>
      <p className="txt-dim mb-2">Set time for event</p>
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
    </PopupContainer>
  );
};

export default EventPopup;
