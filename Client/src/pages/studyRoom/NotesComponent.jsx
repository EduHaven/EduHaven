// import React, { useState, useEffect } from "react";

function NotesComponent() {
  return (
    <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
      <h2 className="text-xl text-white">Add new note</h2>
      <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg">
        +
      </button>
    </div>
  );
}

export default NotesComponent;
