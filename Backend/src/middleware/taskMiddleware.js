import mongoose from 'mongoose';

import Task from '../models/taskModel.js';
import Room from '../models/roomModel.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const requireTaskRoomMember = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  const room = await Room.findOne({
    _id: task.room,
    members: req.user._id,
  });

  if (!room) {
    throw new ApiError(404, 'Task not found');
  }

  req.task = task;
  req.room = room;

  next();
});

export const requireTaskRoomOwner = asyncHandler(async (req, res, next) => {
  if (req.room.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the room owner can manage tasks');
  }

  next();
});
