import mongoose from 'mongoose';

import logger from '../loggers/winston.logger.js';
import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  if (res.headersSent) {
    return next(error);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    error = new ApiError(
      400,
      'Validation failed',
      Object.values(err.errors).map((item) => item.message)
    );
  } else if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, 'Invalid resource ID');
  } else if (err?.code === 11000) {
    error = new ApiError(409, 'A record with this value already exists');
  } else if (!(err instanceof ApiError)) {
    error = new ApiError(500, 'Internal server error');
  }

  const statusCode = error.statusCode || 500;

  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    error: err.message,
    stack: statusCode >= 500 ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors?.length ? { errors: error.errors } : {}),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};

export default errorMiddleware;
