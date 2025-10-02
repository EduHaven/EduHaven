import logger from "../logger/winstonLogger.js";

const notFound = (req, res, next) => {
  logger.warn({
    message: `Not Found - ${req.originalUrl}`,
    method: req.method,
  });

  res.status(404).json({
    success: false,
    message: `Not Found - ${req.originalUrl}`,
  });
};

export default notFound;
