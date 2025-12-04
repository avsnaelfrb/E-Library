import winston from "winston";
import path from "path";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join("logs", "errors.log") }),
  ],
});

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.originalUrl,
  });

  if (err.statusCode >= 500) {
    // Server error, send generic message
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server, silakan coba lagi nanti.",
    });
  } else {
    // Client error, send actual message
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
};

export default errorHandler;
