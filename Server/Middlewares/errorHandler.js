import logger from "../logger/winstonLogger.js";

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message || "Internal Server Error",
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
