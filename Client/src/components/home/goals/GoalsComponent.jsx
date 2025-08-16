import { useState, useEffect } from "react";
import axios from "axios";
import {
  Pencil,
  Trash,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Calendar,
  Repeat,
  Clock,
  RefreshCw,
} from "lucide-react";
import Setgoals from "./SetGoals.jsx";
import DeadlinePickerModal from "./DeadlinePickerModal.jsx";
import { motion } from "framer-motion";
const backendUrl = import.meta.env.VITE_API_URL;

const GoalsComponent = () => {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({
    dailyHabits: false,
    otherGoals: false,
    closedGoals: true,
  });
  const [deadlineModal, setDeadlineModal] = useState({
    isOpen: false,
    todoId: null,
    todoTitle: "",
    currentDeadline: null,
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/todo`, getAuthHeader());
      setTodos(data.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      if (error.response?.status === 401) {
        // window.location.href = "/login";
      }
    }
  };

  // Recreate daily habits on component mount
  const recreateDailyHabits = async () => {
    try {
      await axios.post(
        `${backendUrl}/todo/recreate-daily-habits`,
        {},
        getAuthHeader()
      );
      fetchTodos(); // Refresh the list
    } catch (error) {
      console.error("Error recreating daily habits:", error.message);
    }
  };

  useEffect(() => {
    recreateDailyHabits(); // First recreate habits
    fetchTodos(); // Then fetch all todos
  }, []);

  // Organize todos into sections
  const organizeTodos = () => {
    const dailyHabits = todos.filter(
      (todo) => todo.repeatEnabled && todo.status === "open"
    );
    const otherGoals = todos.filter(
      (todo) => !todo.repeatEnabled && todo.status === "open"
    );
    const closedGoals = todos.filter((todo) => todo.status === "closed");

    return { dailyHabits, otherGoals, closedGoals };
  };

  const { dailyHabits, otherGoals, closedGoals } = organizeTodos();

  // Callback to handle a newly created goal from Setgoals.
  const handleNewGoalCreated = (newGoal) => {
    setTodos([newGoal, ...todos]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/todo/${id}`, getAuthHeader());
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
        status: !todo.completed ? "closed" : "open",
      };

      await axios.put(`${backendUrl}/todo/${id}`, updatedTodo, getAuthHeader());
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error toggling todo:", error.message);
    }
  };

  const handleToggleRepeat = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const updatedTodo = { ...todo, repeatEnabled: !todo.repeatEnabled };

      await axios.put(`${backendUrl}/todo/${id}`, updatedTodo, getAuthHeader());
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error toggling repeat:", error.message);
    }
  };

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      alert("Title cannot be empty!");
      return;
    }
    try {
      const todo = todos.find((t) => t._id === editingId);
      const updatedTodo = { ...todo, title: editedTitle };

      await axios.put(
        `${backendUrl}/todo/${editingId}`,
        updatedTodo,
        getAuthHeader()
      );
      setTodos(
        todos.map((todo) => (todo._id === editingId ? updatedTodo : todo))
      );
      setEditingId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  const openDeadlineModal = (todo) => {
    setDeadlineModal({
      isOpen: true,
      todoId: todo._id,
      todoTitle: todo.title,
      currentDeadline: todo.deadline,
    });
  };

  const closeDeadlineModal = () => {
    setDeadlineModal({
      isOpen: false,
      todoId: null,
      todoTitle: "",
      currentDeadline: null,
    });
  };

  const handleDeadlineSave = async (deadline) => {
    try {
      const updatedTodo = {
        deadline: deadline ? deadline.toISOString() : null,
      };
      await axios.put(
        `${backendUrl}/todo/${deadlineModal.todoId}`,
        updatedTodo,
        getAuthHeader()
      );

      setTodos(
        todos.map((todo) =>
          todo._id === deadlineModal.todoId
            ? { ...todo, deadline: deadline ? deadline.toISOString() : null }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating deadline:", error.message);
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDeadlineInfo = (deadline) => {
    if (!deadline) return null;

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs > 0) {
      if (diffMinutes < 60) {
        return {
          text: `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} left`,
          color: diffMinutes <= 30 ? "text-yellow-500" : "text-green-500",
        };
      } else if (diffHours < 24) {
        return {
          text: `${diffHours} hour${diffHours !== 1 ? "s" : ""} left`,
          color: diffHours <= 2 ? "text-yellow-500" : "text-green-500",
        };
      } else {
        return {
          text: `${diffDays} day${diffDays !== 1 ? "s" : ""} left`,
          color: "text-green-500",
        };
      }
    } else {
      //past deadline - overdue
      const overdueMins = Math.abs(diffMinutes);
      const overdueHours = Math.abs(diffHours);
      const overdueDays = Math.abs(diffDays);

      if (overdueMins < 60) {
        return {
          text: `${overdueMins} minute${overdueMins !== 1 ? "s" : ""} overdue`,
          color: "text-red-500",
        };
      } else if (overdueHours < 24) {
        return {
          text: `${overdueHours} hour${overdueHours !== 1 ? "s" : ""} overdue`,
          color: "text-red-500",
        };
      } else {
        return {
          text: `${overdueDays} day${overdueDays !== 1 ? "s" : ""} overdue`,
          color: "text-red-500",
        };
      }
    }
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  const renderTodoItem = (todo) => (
    <motion.div
      key={todo._id}
      variants={itemVariants}
      className="group flex items-center space-x-2 p-2 px-4 rounded-lg hover:bg-ter cursor-pointer"
    >
      <label className="relative flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleToggle(todo._id)}
          className="w-5 h-5 rounded-full border border-txt-dim appearance-none checked:bg-purple-500 checked:border-purple-500 focus:outline-none"
        />
        {todo.completed && (
          <Check className="absolute w-full txt pointer-events-none" />
        )}
      </label>

      {editingId === todo._id ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="flex-grow bg-transparent border-b border-txt-dim txt-dim py-1 px-2 focus:outline-none"
          autoFocus
        />
      ) : (
        <div className="flex-grow">
          <span
            className={`text-lg ${
              todo.completed ? "line-through txt-dim" : "txt-dim"
            }`}
          >
            {todo.title}
          </span>
          {todo.deadline && (
            <div
              className={`text-xs ${formatDeadlineInfo(todo.deadline)?.color}`}
            >
              <Clock className="inline w-3 h-3 mr-1" />
              {formatDeadlineInfo(todo.deadline)?.text}
            </div>
          )}
        </div>
      )}

      {editingId === todo._id ? (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-400 transition-colors"
          >
            <Check />
          </button>
          <button
            onClick={handleCancel}
            className="txt-dim hover:txt transition-colors"
          >
            <X />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className="txt-dim group-hover:hidden">
            {new Date(todo.dueDate).toLocaleDateString()}
          </span>
          <div className="hidden group-hover:flex gap-2">
            {/* Repeat Toggle */}
            <button
              onClick={() => handleToggleRepeat(todo._id)}
              className={`p-1 rounded ${
                todo.repeatEnabled
                  ? "text-blue-500 bg-blue-100/10"
                  : "txt-dim hover:text-blue-500"
              } transition-colors`}
              title={todo.repeatEnabled ? "Disable repeat" : "Enable repeat"}
            >
              <Repeat className="h-4 w-4" />
            </button>

            {/* Calendar Icon - deadline setting */}
            <button
              onClick={() => openDeadlineModal(todo)}
              className="txt-dim hover:text-purple-500 transition-colors p-1"
              title="Set deadline"
            >
              <Calendar className="h-4 w-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => {
                setEditingId(todo._id);
                setEditedTitle(todo.title);
              }}
              className="txt-dim hover:text-blue-500 transition-colors p-1"
            >
              <Pencil className="h-4 w-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => handleDelete(todo._id)}
              className="txt-dim hover:text-red-500 transition-colors p-1"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderSection = (title, items, sectionKey) => (
    <div className="mb-2.5">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full px-2"
      >
        <div className="flex items-center gap-1">
          {collapsedSections[sectionKey] ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="txt-dim text-sm">({items.length})</span>
        </div>
      </button>

      {!collapsedSections[sectionKey] && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-2"
        >
          {items.length === 0 ? (
            <div className="txt-dim text-center py-4">
              No {title.toLowerCase()} available
            </div>
          ) : (
            items.map(renderTodoItem)
          )}
        </motion.div>
      )}
    </div>
  );

  const openCount = dailyHabits.length + otherGoals.length;
  const closedCount = closedGoals.length;

  return (
    <div className="bg-sec txt rounded-3xl py-6 pb-2 w-full mx-auto relative shadow">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 px-6">
        <h1 className="text-2xl font-semibold">Goals</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">●</span>
            <span>{openCount} Open</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="txt-dim">●</span>
            <span>{closedCount} Closed</span>
          </div>
          <motion.button
          whileTap={{rotate:180}}
            onClick={recreateDailyHabits}
            className="p-1 rounded hover:bg-ter txt-dim hover:txt transition-colors"
            title="Recreate daily habits"
          >
            <RefreshCw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Set goals */}
      <div className="h-11"></div>
      <div className="absolute left-0 right-0 z-10 top-16">
        <Setgoals onGoalCreated={handleNewGoalCreated} />
      </div>

      {/* Tasks List Section */}
      <div className="w-full max-h-[17.5rem] overflow-y-auto pt-2 px-2">
        {dailyHabits.length !== 0 &&
          renderSection(
            "Daily Habit",
            dailyHabits,
            "dailyHabits",
            <Repeat className="h-4 w-4 text-blue-500" />
          )}

        {otherGoals.length !== 0 &&
          renderSection(
            "Tasks",
            otherGoals,
            "otherGoals",
            <Clock className="h-4 w-4 text-purple-500" />
          )}

        {closedGoals.length !== 0 &&
          renderSection(
            "Completed",
            closedGoals,
            "closedGoals",
            <Check className="h-4 w-4 text-green-500" />
          )}
      </div>

      <DeadlinePickerModal
        isOpen={deadlineModal.isOpen}
        onClose={closeDeadlineModal}
        onSave={handleDeadlineSave}
        currentDeadline={deadlineModal.currentDeadline}
        todoTitle={deadlineModal.todoTitle}
      />
    </div>
  );
};

export default GoalsComponent;
