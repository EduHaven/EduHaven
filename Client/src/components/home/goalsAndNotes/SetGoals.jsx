import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./ReactCustomCalendar.css";

const Setgoals = ({ onGoalCreated }) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [time, setTime] = useState("21:00");
  const [reminder, setReminder] = useState("On the day (9:00)");
  const [repeat, setRepeat] = useState("Daily");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };
  const backendUrl = import.meta.env.VITE_API_URL;

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    try {
      const dueDate = deadline
        ? deadline.toISOString()
        : new Date().toISOString();
      const { data } = await axios.post(
        `${backendUrl}/todo`,
        {
          title,
          completed: false,
          dueDate,
        },
        getAuthHeader()
      );
      setTitle("");
      setDeadline(null);
      if (onGoalCreated) {
        onGoalCreated(data.data);
      }
    } catch (error) {
      console.error("Error creating goal:", error.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div
      className={`px-2 sm:px-3 md:px-4 pt-2 rounded-lg sm:rounded-xl ${title.trim() !== "" ? "bg-ter shadow" : ""
        }`}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center px-1 sm:px-2">
        <input
          type="text"
          placeholder="Type a goal..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          className="w-full bg-transparent border-b border-txt-dim txt-dim py-1.5 sm:py-2 px-1 sm:px-2 focus:outline-none text-sm sm:text-base"
        />
        <button onClick={handleCreate} className="txt ml-1 sm:ml-2 p-1 hover:bg-primary rounded">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      {/* Render when there's some text in the input */}
      {title.trim() !== "" && (
        <>
          <p className="text-red-400 text-xs sm:text-sm px-1 sm:px-2 mt-2">Currently only calendar is functional.</p>
          <div className="mt-3 mb-4 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
            <div className="flex-1 space-y-3 sm:space-y-4">
              {/* Repeat Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <label className="block font-semibold text-sm sm:text-base min-w-fit">Repeat:</label>
                <select
                  className="bg-ter rounded-lg p-1.5 sm:p-2 w-full txt border border-txt-dim text-sm sm:text-base"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                >
                  {["Never", "Daily", "Weekly", "Monthly", "Yearly"].map(
                    (r) => (
                      <option key={r} value={r} className="txt bg-sec">
                        {r}
                      </option>
                    )
                  )}
                </select>
              </div>
              {/* Time Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <label className="block font-semibold text-sm sm:text-base min-w-fit">Time:</label>
                <select
                  className="bg-ter rounded-lg p-1.5 sm:p-2 w-full txt border border-txt-dim text-sm sm:text-base"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  {[
                    "20:30",
                    "21:00",
                    "21:30",
                    "22:00",
                    "22:30",
                    "23:00",
                    "23:30",
                  ].map((t) => (
                    <option key={t} value={t} className="txt bg-sec">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {/* Reminder Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <label className="block font-semibold text-sm sm:text-base min-w-fit">Reminder:</label>
                <select
                  className="bg-ter rounded-lg p-1.5 sm:p-2 w-full txt border border-txt-dim text-sm sm:text-base"
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                >
                  {[
                    "On the day (9:00)",
                    "1 day early (9:00)",
                    "2 days early (9:00)",
                    "3 days early (9:00)",
                    "7 days early (9:00)",
                    "On the day (5:00)",
                  ].map((r) => (
                    <option key={r} value={r} className="txt bg-sec">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full lg:max-w-fit rounded-lg mx-auto lg:mx-0">
              <h1 className="font-semibold text-sm sm:text-base mb-2 text-center lg:text-left">Add deadline:</h1>
              <div className="flex justify-center lg:justify-start">
                <Calendar
                  onChange={(date) => setDeadline(date)}
                  value={deadline || new Date()}
                  next2Label={null}
                  prev2Label={null}
                  className="!max-w-full !w-full sm:!w-auto"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Setgoals;
