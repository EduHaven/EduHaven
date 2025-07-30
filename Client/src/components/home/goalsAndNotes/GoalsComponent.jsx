import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash, Check, X } from "lucide-react";
import Setgoals from "./SetGoals.jsx";
const backendUrl = import.meta.env.VITE_API_URL;

const GoalsComponent = () => {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const sortTodos = (todosArray) => {
    return [...todosArray].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // For incomplete tasks, show newest first; for completed, oldest first.
      return a.completed
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/todo`,
        getAuthHeader()
      );
      setTodos(sortTodos(data.data));
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      if (error.response?.status === 401) {
        // window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Callback to handle a newly created goal from Setgoals.
  const handleNewGoalCreated = (newGoal) => {
    setTodos(sortTodos([newGoal, ...todos]));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/todo/${id}`, getAuthHeader());
      setTodos(sortTodos(todos.filter((todo) => todo._id !== id)));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(
        `${backendUrl}/todo/${id}`,
        updatedTodo,
        getAuthHeader()
      );
      setTodos(
        sortTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)))
      );
    } catch (error) {
      console.error("Error toggling todo:", error.message);
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
        sortTodos(
          todos.map((todo) => (todo._id === editingId ? updatedTodo : todo))
        )
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const openCount = todos.length - completedCount;

  return (
    <div className="bg-sec txt rounded-2xl sm:rounded-3xl py-4 sm:py-6 pb-2 w-full mx-auto relative shadow">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 sm:mb-6 px-3 sm:px-6 gap-2 xs:gap-0">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">Goals</h1>
        <div className="flex space-x-3 sm:space-x-4 text-sm sm:text-base">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">●</span>
            <span>{openCount} Open</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="txt-dim">●</span>
            <span>{completedCount} Closed</span>
          </div>
        </div>
      </div>

      {/* Set goals */}
      <div className="h-8 sm:h-11"></div>
      <div className="absolute left-0 right-0 z-10 top-16 sm:top-20">
        <Setgoals onGoalCreated={handleNewGoalCreated} />
      </div>

      {/* Tasks List Section */}
      <div className="w-full max-h-64 sm:max-h-72 lg:max-h-80 overflow-y-auto pt-4 sm:pt-6 px-1 sm:px-2">
        {todos.length === 0 ? (
          <div className="txt-dim px-3 sm:px-4 py-4 sm:py-6 text-center text-sm sm:text-base">No tasks available</div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="group flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 px-3 sm:px-4 rounded-lg hover:bg-ter cursor-pointer"
            >
              <label className="relative flex items-center shrink-0">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id)}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-txt-dim appearance-none checked:bg-purple-500 checked:border-purple-500 focus:outline-none"
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
                  className="flex-grow bg-transparent border-b border-txt-dim txt-dim py-1 px-1 sm:px-2 focus:outline-none text-sm sm:text-base"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-grow text-sm sm:text-base lg:text-lg ${todo.completed ? "line-through txt-dim" : "txt-dim"
                    }`}
                >
                  {todo.title}
                </span>
              )}
              {editingId === todo._id ? (
                <div className="flex gap-2 sm:gap-4 shrink-0">
                  <button
                    onClick={handleSave}
                    className="text-green-500 hover:text-green-400 transition-colors"
                  >
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="txt-dim hover:txt transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                  <span className="txt-dim text-xs sm:text-sm hidden md:block md:group-hover:hidden">
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                  <div className="flex md:hidden md:group-hover:flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditedTitle(todo.title);
                      }}
                      className="txt-dim hover:text-blue-500 transition-colors p-1 rounded hover:bg-primary"
                    >
                      <Pencil className="h-4 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="txt-dim hover:text-red-500 transition-colors p-1 rounded hover:bg-primary"
                    >
                      <Trash className="h-4 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalsComponent;
