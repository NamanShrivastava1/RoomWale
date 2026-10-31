import mongoose from 'mongoose';

import Room from '../models/roomModel.js';
import Task from '../models/taskModel.js';
import TaskCompletion from '../models/taskCompletion.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateInviteCode from '../utils/generateInviteCode.js';

const createUniqueInviteCode = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const inviteCode = generateInviteCode();

    const existingRoom = await Room.exists({ inviteCode });

    if (!existingRoom) {
      return inviteCode;
    }
  }

  throw new ApiError(500, 'Unable to generate an invitation code');
};

export const createRoom = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) {
    throw new ApiError(400, 'Room name must be between 2 and 80 characters');
  }

  const inviteCode = await createUniqueInviteCode();

  const room = await Room.create({
    name: name.trim(),
    owner: req.user._id,
    members: [req.user._id],
    inviteCode,
  });

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: {
      room: {
        id: room._id,
        name: room.name,
        owner: room.owner,
        members: room.members,
        inviteCode,
        timezone: room.timezone,
      },
    },
  });
});

export const getMyRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({
    members: req.user._id,
  })
    .select('name owner members timezone createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: { rooms },
  });
});

export const getRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.room._id)
    .select('name owner members timezone createdAt updatedAt')
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .lean();

  res.status(200).json({
    success: true,
    data: { room },
  });
});

export const joinRoom = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (typeof inviteCode !== 'string' || !inviteCode.trim()) {
    throw new ApiError(400, 'Invitation code is required');
  }

  const normalizedCode = inviteCode.trim().toUpperCase();

  const room = await Room.findOne({
    inviteCode: normalizedCode,
  }).select('+inviteCode');

  if (!room) {
    throw new ApiError(404, 'Invalid invitation code');
  }

  const isAlreadyMember = room.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (isAlreadyMember) {
    return res.status(200).json({
      success: true,
      message: 'You are already a member of this room',
      data: {
        roomId: room._id,
      },
    });
  }

  room.members.push(req.user._id);

  await room.save();

  res.status(200).json({
    success: true,
    message: 'Joined room successfully',
    data: {
      roomId: room._id,
      roomName: room.name,
    },
  });
});

export const regenerateInviteCode = asyncHandler(async (req, res) => {
  const inviteCode = await createUniqueInviteCode();

  // Atomic update avoids returning a stale code if two owner requests overlap.
  const updatedRoom = await Room.findOneAndUpdate(
    {
      _id: req.room._id,
      owner: req.user._id,
    },
    {
      $set: { inviteCode },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRoom) {
    throw new ApiError(404, 'Room not found');
  }

  res.status(200).json({
    success: true,
    message: 'Invitation code regenerated',
    data: {
      inviteCode,
    },
  });
});

export const leaveRoom = asyncHandler(async (req, res) => {
  const room = req.room;

  if (room.owner.toString() === req.user._id.toString()) {
    throw new ApiError(
      400,
      'The room owner cannot leave without transferring ownership or deleting the room'
    );
  }

  room.members = room.members.filter((memberId) => memberId.toString() !== req.user._id.toString());

  await room.save();

  res.status(200).json({
    success: true,
    message: 'You have left the room',
  });
});
