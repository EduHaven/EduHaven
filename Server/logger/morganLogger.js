import morgan from "morgan";
import logger from "./winstonLogger.js";

const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default morganMiddleware;
