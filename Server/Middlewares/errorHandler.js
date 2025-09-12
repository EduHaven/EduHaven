// Previous implementation 
// export default (err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// };

import logger from "../logger/winstonLogger.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "prod" : err.stack,
    });
};

export default errorHandler;