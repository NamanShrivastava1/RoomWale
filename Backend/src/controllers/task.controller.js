import mongoose from 'mongoose';

import Task from '../models/taskModel.js';
import Room from '../models/roomModel.js';
import TaskCompletion from '../models/taskCompletion.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description = '', points = 1 } = req.body;

  if (typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 100) {
    throw new ApiError(400, 'Task title must be between 2 and 100 characters');
  }

  if (typeof description !== 'string' || description.length > 500) {
    throw new ApiError(400, 'Description cannot exceed 500 characters');
  }

  if (typeof points !== 'number' || !Number.isFinite(points) || points < 0 || points > 100) {
    throw new ApiError(400, 'Points must be a number between 0 and 100');
  }

  const task = await Task.create({
    room: req.room._id,
    title: title.trim(),
    description: description.trim(),
    points,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: { task },
  });
});

export const getRoomTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    room: req.room._id,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { tasks },
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, points } = req.body;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 100) {
      throw new ApiError(400, 'Task title must be between 2 and 100 characters');
    }

    updates.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.length > 500) {
      throw new ApiError(400, 'Invalid task description');
    }

    updates.description = description.trim();
  }

  if (points !== undefined) {
    if (typeof points !== 'number' || !Number.isFinite(points) || points < 0 || points > 100) {
      throw new ApiError(400, 'Points must be between 0 and 100');
    }

    updates.points = points;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'Provide at least one field to update');
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      room: req.room._id,
      isActive: true,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: { task },
  });
});

export const deactivateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: taskId,
      room: req.room._id,
      isActive: true,
    },
    {
      $set: { isActive: false },
    },
    {
      new: true,
    }
  );

  if (!task) {
    throw new ApiError(404, 'Active task not found');
  }

  res.status(200).json({
    success: true,
    message: 'Task deactivated successfully',
  });
});

export const completeTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { completionDate, note = '' } = req.body;

  if (!mongoose.isValidObjectId(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  if (typeof completionDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(completionDate)) {
    throw new ApiError(400, 'A completion date in YYYY-MM-DD format is required');
  }

  // Reject impossible dates such as 2026-02-31.
  const parsedDate = new Date(`${completionDate}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== completionDate
  ) {
    throw new ApiError(400, 'Invalid completion date');
  }

  if (typeof note !== 'string' || note.length > 300) {
    throw new ApiError(400, 'Note cannot exceed 300 characters');
  }

  const task = await Task.findOne({
    _id: taskId,
    room: req.room._id,
    isActive: true,
  });

  if (!task) {
    throw new ApiError(404, 'Active task not found in this room');
  }

  const completion = await TaskCompletion.create({
    room: req.room._id,
    task: task._id,
    completedBy: req.user._id,
    completionDate,
    note: note.trim(),
  });

  res.status(201).json({
    success: true,
    message: 'Task completion recorded',
    data: { completion },
  });
});

export const getCompletionsByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, 'Provide a date in YYYY-MM-DD format');
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new ApiError(400, 'Invalid date');
  }

  const completions = await TaskCompletion.find({
    room: req.room._id,
    completionDate: date,
  })
    .populate('task', 'title points')
    .populate('completedBy', 'name')
    .sort({ completedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: {
      date,
      completions,
    },
  });
});

export const getRoomStats = asyncHandler(async (req, res) => {
  const { from, to } = req.query;

  if (
    typeof from !== 'string' ||
    typeof to !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    throw new ApiError(400, 'Provide valid from and to dates');
  }

  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T00:00:00.000Z`);

  if (
    Number.isNaN(fromDate.getTime()) ||
    Number.isNaN(toDate.getTime()) ||
    fromDate.toISOString().slice(0, 10) !== from ||
    toDate.toISOString().slice(0, 10) !== to ||
    from > to
  ) {
    throw new ApiError(400, 'Invalid date range');
  }

  const stats = await TaskCompletion.aggregate([
    {
      $match: {
        room: req.room._id,
        completionDate: {
          $gte: from,
          $lte: to,
        },
      },
    },
    {
      $group: {
        _id: '$completedBy',
        completedTasks: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        completedTasks: 1,
      },
    },
    {
      $sort: {
        completedTasks: -1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      from,
      to,
      stats,
    },
  });
});
