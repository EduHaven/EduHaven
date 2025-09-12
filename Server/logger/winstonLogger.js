import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../logs");

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), logFormat),
    transports: [
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
        }),
        new winston.transports.File({
            filename: path.join(logDir, "combined.log"),
        }),
    ],
});

// Console log for development
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

export default logger;