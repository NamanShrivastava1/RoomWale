import mongoose from 'mongoose';

import Room from '../models/roomModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const requireRoomMember = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, 'Invalid room ID');
  }

  const room = await Room.findOne({
    _id: roomId,
    members: req.user._id,
  });

  if (!room) {
    throw new ApiError(404, 'Room not found');
  }

  req.room = room;

  next();
});

export const requireRoomOwner = asyncHandler(async (req, res, next) => {
  if (!req.room) {
    throw new ApiError(500, 'Room authorization middleware missing');
  }

  if (req.room.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the room owner can perform this action');
  }

  next();
});
