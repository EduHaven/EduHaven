import { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Planner() {
  const [tasks, setTasks] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );

  const [newTask, setNewTask] = useState("");
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);

  // Add a task with a stable id
  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;

    const task = {
      id: Date.now(), // simple unique id
      text,
      completed: false,
    };

    setTasks((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], task],
    }));
    setNewTask("");
  };

  // Toggle by id (immutable)
  const toggleTask = (day, id) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  // Delete by id (immutable)
  const deleteTask = (day, id) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((t) => t.id !== id),
    }));
  };

  // Optional: handle Enter key in input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Weekly Planner</h1>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Weekly columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-4 border rounded-xl shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{day}</h2>

            {tasks[day].length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks yet</p>
            ) : (
              <ul className="space-y-2">
                {tasks[day].map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      {/* checkbox */}
                      <input
                        aria-label={`Mark task "${task.text}" as completed`}
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={() => toggleTask(day, task.id)}
                        className="w-5 h-5 accent-blue-600"
                      />

                      {/* text */}
                      <span
                        className={`break-words ${
                          task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {task.text}
                      </span>
                    </label>

                    {/* delete */}
                    <button
                      onClick={() => deleteTask(day, task.id)}
                      className="ml-3 text-red-500 hover:text-red-700 text-sm"
                      aria-label={`Delete task ${task.text}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
