<<<<<<< HEAD
import { useState } from "react";
import axios from "axios";

function TodoComponent() {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDueDateChange = (e) => setDueDate(e.target.value);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      setError("Both title and due date are required.");
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:3000/todo", {
        title: title,
        dueDate: dueDate,
      });

      if (response.data.success) {
        alert("Todo created successfully!");
        setTitle("");  // Reset the title field
        setDueDate("");  // Reset the dueDate field
      }
    } catch (err) {
      setError("Error creating todo: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-white text-xl font-semibold mb-4">Create New Todo</h2>
      <form onSubmit={handleAddTodo} className="space-y-4">
        <div>
          <label htmlFor="title" className="text-white block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter todo title"
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="text-white block mb-1">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={handleDueDateChange}
            className="w-full text-black p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}
=======
import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch all to-dos
  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/todo");
      setTodos(data.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  // Create a new to-do
  const handleCreate = async () => {
    if (!title || !dueDate) {
      alert("Title and Due Date both are required!");
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:3000/todo", {
        title,
        dueDate,
      });
      setTodos([...todos, data.data]);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Error creating todo:", error.message);
    }
  };

  // Delete a to-do
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todo/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center space-y-6">
      <h2 className="text-2xl text-white">To-Do List</h2>

      {/* Input Fields */}
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded border bg-gray-700"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 rounded border bg-gray-700"
        />
        <button
          onClick={handleCreate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          Add To-Do
        </button>
      </div>

      {/* Display To-Do List with Scroll Effect */}
      <div className="space-y-4 w-full max-h-80 overflow-y-auto">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
          >
            <div className="text-white">
              <h3 className="text-lg font-semibold">{todo.title}</h3>
              <p className="text-sm">{new Date(todo.dueDate).toDateString()}</p>
            </div>
            <button
              onClick={() => handleDelete(todo._id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6

export default TodoComponent;
