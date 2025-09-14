import compression from "compression";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { NODE_ENV, CORS_ORIGIN } from "../index.js";

export function applyCommonMiddleware(app) {
  // ---- Middlewares (safe defaults) ----
  app.use(compression()); // optional, small perf boost
  if (NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
  // body parsing with limits to avoid huge payloads
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true, limit: "100kb" }));

  app.use(
    cors({
      origin: (origin, cb) => {
        // allow non-browser tools (no origin)
        if (!origin) return cb(null, true);
        if (origin === CORS_ORIGIN) return cb(null, true);
        cb(new Error("CORS blocked by server"), false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  app.use(cookieParser());
}
