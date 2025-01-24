<<<<<<< HEAD
// import React, { useState, useEffect } from "react";

function NotesComponent() {
  return (
    <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl text-white">Add new note</h2>
      <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg">
        +
      </button>
=======
import { useState, useEffect } from "react";
import axios from "axios";

function NotesComponent() {
  const [noteInput, setNoteInput] = useState(""); // State for new note title
  const [noteContent, setNoteContent] = useState(""); // State for new note content
  const [notes, setNotes] = useState([]); // State to store notes
  const [error, setError] = useState(""); // State to handle errors

  // Fetch all notes when the component loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/note");
        if (response.data.success) {
          setNotes(response.data.data); // Store notes
        } else {
          setError("Failed to fetch notes");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchNotes();
  }, []);

  // Add a new note
  const handleAddNote = async () => {
    if (noteInput.trim() === "" || noteContent.trim() === "") {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/note", {
        title: noteInput,
        content: noteContent,
      });

      if (response.data.success) {
        setNotes([response.data.data, ...notes]); // Add the new note to the top
        setNoteInput(""); // Clear the input fields
        setNoteContent("");
        setError(""); // Clear any errors
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add note");
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/note/${id}`);
      if (response.data.success) {
        setNotes(notes.filter((note) => note._id !== id)); // Remove the deleted note
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete note");
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md mx-auto flex flex-col items-center space-y-4">
      <h2 className="text-xl text-white">Notes</h2>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Input Section */}
      <div className="flex flex-col w-full space-y-2">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Enter note title"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600"
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter note content"
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-purple-600 h-20 resize-none"
        />
        <button
          onClick={handleAddNote}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white"
        >
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="w-full h-64 overflow-y-auto bg-gray-700 p-4 rounded-lg space-y-2">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-gray-800 text-white p-3 rounded-lg shadow-md flex justify-between items-start"
            >
              <div>
                <h3 className="font-bold">{note.title}</h3>
                <p className="text-sm text-gray-400">{note.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="bg-red-600 hover:bg-red-700 px-2 py-1 text-xs rounded-lg text-white"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No notes to  display</p>
        )}
      </div>
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
    </div>
  );
}

export default NotesComponent;
<<<<<<< HEAD
=======
 
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
