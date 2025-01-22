import React, { useState, useEffect } from "react";
import { User } from 'lucide-react';
import { Link } from "react-router-dom";

function StudyRoom() {
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 }); // Start timer from zero
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const newSeconds = prevTime.seconds + 1; // Increment seconds
                    if (newSeconds === 60) {
                        const newMinutes = prevTime.minutes + 1; // Increment minutes
                        if (newMinutes === 60) {
                            const newHours = prevTime.hours + 1; // Increment hours
                            return { hours: newHours, minutes: 0, seconds: 0 }; // Reset minutes and seconds when hours increase
                        }
                        return { ...prevTime, minutes: newMinutes, seconds: 0 }; // Reset seconds when minutes increase
                    }
                    return { ...prevTime, seconds: newSeconds }; // Just increment seconds
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // const handleStart = () => setIsRunning(true);

    const handleStartPause = () => {
        setIsRunning((prev) => !prev); // Toggle between start and pause
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime({ hours: 0, minutes: 0, seconds: 0 }); // Reset timer to zero
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Study Room</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400">Next goal: 2 hours</span>
                    <span className="text-gray-400">Total uptime today: 4 hours</span>
                </div>
                <Link className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2" to="/authenticate">
                    <User className="w-5 h-5" />
                    Login
                </Link>
            </div>

            {/* Timer Section */}
            <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center">
                <h1 className="text-lg">Timer</h1>
                <div className="text-center">
                    <div className="text-6xl font-bold mb-4">
                        <span>{String(time.hours).padStart(2, "0")}</span>
                        <span className="text-gray-400">:</span>
                        <span>{String(time.minutes).padStart(2, "0")}</span>
                        <span className="text-gray-400">:</span>
                        <span>{String(time.seconds).padStart(2, "0")}</span>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleStartPause}
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
                        >
                            {isRunning ? "Pause" : "Start"}
                        </button>
                        <button
                            onClick={handleReset}
                            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Notes and Todos */}
            <div className="grid grid-cols-1 gap-8">
                {/* Other sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
                        <h2 className="text-xl text-white">Add new tasks hear</h2>
                        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg">
                            +
                        </button>
                    </div>
                    <div className="bg-gray-800 p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
                        <h2 className="text-xl text-white">Add new note</h2>
                        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg">
                            +
                        </button>
                    </div>
                </div>
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-semibold text-white">Calendar</h1>
                    <h2 className="text-xl text-gray-300">Today's Wednesday</h2>
                    <h3 className="text-xl text-gray-400 mb-4">9:45 PM</h3>
                    <br />
                    <div className="calendar space-y-4">
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day labels */}
                            <div className="text-center text-sm font-bold text-gray-300">
                                Sun
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Mon
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Tue
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Wed
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Thu
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Fri
                            </div>
                            <div className="text-center text-sm font-bold text-gray-300">
                                Sat
                            </div>

                            {/* Calendar Days */}
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 cursor-pointer transition-all duration-200 ease-in-out">
                                1
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                2
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                3
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 cursor-pointer transition-all duration-200 ease-in-out">
                                4
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                5
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                6
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 cursor-pointer transition-all duration-200 ease-in-out">
                                7
                            </div>

                            {/* More days in the calendar */}
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                8
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                9
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                10
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                11
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                12
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                13
                            </div>
                            <div className="flex items-center justify-center p-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all duration-200 ease-in-out">
                                14
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discussion Rooms */}
            <div className="grid grid-cols-3 gap-8">
                {["Room 1", "Room 2", "Room 3"].map((room) => (
                    <div key={room} className="bg-gray-800 p-6 rounded-xl">
                        <h3 className="font-semibold mb-2">{room}</h3>
                        <p className="text-gray-400 text-sm mb-4">4 students studying</p>
                        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg w-full">
                            Join Room hear
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudyRoom;