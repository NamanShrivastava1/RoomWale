import jwt from 'jsonwebtoken';

import { config } from '../config/config.js';
import User from '../models/userModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  let decoded;

  try {
    decoded = jwt.verify(token, config.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired access token');
  }

  const user = await User.findById(decoded.id).select('_id name email');

  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = user;
  next();
});

export default authMiddleware;
