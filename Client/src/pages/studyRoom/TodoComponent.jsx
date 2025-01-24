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

export default TodoComponent;
