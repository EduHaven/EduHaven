// Previous implementation 
// export default (req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Not Found - ${req.originalUrl}`,
//   });
// };

import logger from "../logger/winstonLogger.js";

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    logger.error(error.message); // Log the 404 error
    res.status(404).json({ message: error.message });
};

export default notFound;