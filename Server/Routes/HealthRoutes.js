import { NODE_ENV } from "../index.js";

export function mountHealthRoutes(app) {
  app.get("/uptime", (req, res) =>
    res.status(200).json({
      status: "ok",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    })
  );

  app.get("/", (req, res) => res.send(`Hello, World! (${NODE_ENV})`));
}
