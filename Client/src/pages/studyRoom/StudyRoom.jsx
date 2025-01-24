import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { User , Headphones } from "lucide-react";
import { Link } from "react-router-dom";
=======
import { User, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import Ai from "./AiChatbot.jsx";
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6

import Calender from "./CalendarComponent.jsx";
import TimerComponent from "./TimerComponent.jsx";
import NotesComponent from "./NotesComponent.jsx";
import TodoComponent from "./TodoComponent.jsx";
<<<<<<< HEAD
=======

>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
// import axios from "axios";

function StudyRoom() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
<<<<<<< HEAD
=======
  const [selectedId, setSelectedId] = useState(""); // for AI
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* nav-bar  */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Study Room</h1>
<<<<<<< HEAD
        <span className="text-gray-400">Total uptime today: 4 hours</span>
=======
        <div className="flex items-center">
          <span className="text-gray-400">Total uptime today: 4 hours</span>
          {/* ai */}
          <div>
            <Ai onShowId={setSelectedId} />
            {/* {selectedId && (
              <dialog
                id="my_modal_1"
                className="modal backdrop:bg-black/50"
                open
              >
                <div className="modal-box bg-gray-900 text-white rounded-xl shadow-2xl p-8 max-w-lg mx-auto">
                  <h3 className="font-extrabold text-3xl mb-6 text-purple-400">
                    Element ID Display
                  </h3>
                  <p className="py-4 text-gray-300 leading-relaxed">
                    The clicked element ID is:{" "}
                    <span className="text-green-400 font-bold">
                      {selectedId}
                    </span>
                  </p>
                  <div className="modal-action flex justify-end">
                    <button
                      onClick={() => setSelectedId("")}
                      className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </dialog>
            )} */}
          </div>
        </div>
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
        {!isLoggedIn && (
          <Link
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
            to="/authenticate"
          >
            <User className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>

      <div className="flex gap-8 w-full h-auto">
        <div className="flex-1 h-100 flex flex-col gap-8">
          <TimerComponent />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
<<<<<<< HEAD
            <TodoComponent />
            <NotesComponent />
=======
            <NotesComponent />
            <TodoComponent />
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
          </div>
        </div>
        <Calender />
      </div>

      {/* Discussion Rooms */}
      <h1 className="text-2xl font-bold">Connect with friends</h1>
      <div className="grid grid-cols-3 gap-8">
        {["Room 1", "Room 2", "Room 3"].map((room) => (
          <div key={room} className="bg-gray-800 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">{room}</h3>
            <p className="text-gray-400 text-sm mb-4">4 students studying</p>
            <button className="bg-gray-700 hover:bg-purple-700 px-4 py-2 rounded-lg w-full flex gap-3 transition-all duration-200 ease-in-out">
<<<<<<< HEAD
            <Headphones />Join Room
=======
              <Headphones />
              Join Room
>>>>>>> d9c54aa3aac7a944818d1529908f274ea068f4b6
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyRoom;
