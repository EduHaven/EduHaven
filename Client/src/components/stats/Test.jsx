import axiosInstance from "@/utils/axios";
import { useState } from "react";
function App() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [period, setPeriod] = useState("");
  const [stats, setStats] = useState(null);

  // Handle POST request to log session
  const handlePostSession = async (e) => {
    e.preventDefault();
    const sessionData = { startTime, endTime, duration };

    try {
      const response = await axiosInstance.post("study-sessions", sessionData);

      const result = await response.data;
      console.log("Session logged:", result);
    } catch (error) {
      console.error("Error logging session:", error);
    }
  };

  // Handle GET request to fetch statistics
  const handleGetStats = async () => {
    try {
      const response = await axiosInstance.get(
        `/study-sessions/stats?period=${period}`
      );

      const result = await response.data;
      setStats(result);
      console.log("Fetched Stats:", result);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div className="text-green-500">
      <br />
      <hr />
      <br />
      <h1>Added this for testing</h1>
      <h1>Test graph by saving custom timings without timer.</h1>
      <h1>I will remove it later.</h1>
      <br />
      <h1>Study Session Tracker</h1>

      <form onSubmit={handlePostSession}>
        <label htmlFor="startTime">Start Time:</label>
        <input
          type="datetime-local"
          id="startTime"
          value={startTime}
          onChange={(e) => {
            setStartTime(e.target.value);
            if (startTime) {
              console.log("Start Time Set:", startTime);
            }
          }}
          required
        />
        <br />
        <br />

        <label htmlFor="endTime">End Time:</label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <br />
        <br />

        <label htmlFor="duration">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <br />
        <br />

        <button type="submit">Log Session</button>
      </form>

      <br />
      <br />
      <hr />
      <br />

      <h2>Get Statistics</h2>
      <label htmlFor="period">Period (hourly, daily, weekly, monthly):</label>
      <input
        type="text"
        id="period"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        placeholder="Enter period"
      />
      <br />
      <br />

      <button onClick={handleGetStats}>Get Stats</button>

      {stats && (
        <div>
          <h3>Statistics</h3>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
