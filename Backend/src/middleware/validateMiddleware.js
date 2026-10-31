import ApiError from '../utils/ApiError.js';

const validateBody = (allowedFields) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return next(new ApiError(400, 'Invalid request body'));
    }

    const unexpectedFields = Object.keys(req.body).filter((key) => !allowedFields.includes(key));

    if (unexpectedFields.length > 0) {
      return next(new ApiError(400, `Unexpected fields: ${unexpectedFields.join(', ')}`));
    }

    next();
  };
};

export default validateBody;
