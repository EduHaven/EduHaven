import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Analytics } from '@vercel/analytics/react';

// 🧠 Import the ThemeProvider
import { ThemeProvider } from "./context/ThemeContext"; // adjust path if needed

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Analytics />
    </ThemeProvider>
  </StrictMode>
);
