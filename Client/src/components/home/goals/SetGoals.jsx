import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import { Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./ReactCustomCalendar.css";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import styles from "./SetGoals.module.css";

const Setgoals = ({ onGoalCreated}) => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [time, setTime] = useState("21:00");
  const [reminder, setReminder] = useState("On the day (9:00)");
  const [repeat, setRepeat] = useState("Never");
  const [is24, setIs24] = useState(false);

  useEffect(() => {
    const format = localStorage.getItem("clock-format");
    setIs24(format === "24-hour");
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };
  const backendUrl = import.meta.env.VITE_API_URL;

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.warning("Title is required!");
      return;
    }
    try {
      const dueDate = deadline
        ? deadline.toISOString()
        : new Date().toISOString();

      const taskData = {
        title,
        completed: false,
        dueDate,
        deadline: deadline ? deadline.toISOString() : null,
        repeatEnabled: repeat !== "Never",
        repeatType: repeat.toLowerCase(),
        reminderTime: reminder,
        timePreference: time,
      };

      const { data } = await axios.post(
        `${backendUrl}/todo`,
        taskData,
        getAuthHeader()
      );

      setTitle("");
      setDeadline(null);
      setTime("21:00");
      setRepeat("Never");
      setReminder("On the day (9:00)");

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
      className={`px-4 pt-2 rounded-xl ${
        title.trim() !== "" ? "bg-ter shadow" : ""
      }`}
      style={{ containerType: "inline-size" }}
    >
      <div className="flex items-center px-2">
        <input
          type="text"
          placeholder="Type a goal..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          className="w-full bg-transparent border-b border-txt-dim txt-dim py-2 px-2 focus:outline-none"
        />
          {title.trim() !== "" && (
            <motion.button
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              whileHover={{ scale: 1.05 }}
              animate={{ scale: 1, transition: { duration: 0 } }}
              onClick={handleCreate}
              className={`add-goal-btn ml-2 font-bold shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${styles["add-goal-btn"]}`}
              aria-label="Add Goal"
              type="button"
            >
              Add
            </motion.button>
          )}
      </div>

      {title.trim() !== "" && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="mt-3 mb-4 flex gap-6 [@container(max-width:420px)]:flex-col"
          >
            <div className="flex-1">
              <div className="mb-4 [@container(max-width:420px)]:flex gap-12 items-center">
                <label className="block font-semibold mb-1">Repeat:</label>
                <select
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
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

              {/* Updated Time Input */}
              <div className="mb-4 [@container(max-width:420px)]:flex gap-16 items-center">
                <label className="block font-semibold mb-1">
                  Time{" "}
                  <span className="text-xs text-txt-dim ml-1">
                    ({is24 ? "24-hour" : "12-hour"})
                  </span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
                  step="60"
                />
              </div>

              <div className="[@container(max-width:420px)]:flex gap-7 items-center">
                <label className="block font-semibold mb-1">Reminder:</label>
                <select
                  className="bg-ter rounded-lg p-2 w-full txt border border-txt-dim"
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
            <div className="max-w-fit rounded-lg m-auto">
              <h1 className="font-semibold text-md">Add deadline:</h1>
              <Calendar
                onChange={(date) => setDeadline(date)}
                value={deadline || new Date()}
                next2Label={null}
                prev2Label={null}
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Setgoals;