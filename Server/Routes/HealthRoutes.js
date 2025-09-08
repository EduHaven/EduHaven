import { NODE_ENV } from "../Config/envConfig.js";

export function mountHealthRoutes(app) {
    // ---- Health + basic routes ----
    app.get("/uptime", (req, res) =>
        res.status(200).json({
            status: "ok",
            message: "Server is healthy",
            timestamp: new Date().toISOString(),
        })
    );

    app.get("/", (req, res) => res.send(`Hello, World! (${NODE_ENV})`));
}