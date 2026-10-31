import { Router } from 'express';

import {
  createRoom,
  getMyRooms,
  getRoom,
  joinRoom,
  regenerateInviteCode,
  leaveRoom,
} from '../controllers/room.controller.js';

import authMiddleware from '../middleware/authMiddleware.js';
import validateBody from '../middleware/validateMiddleware.js';

import { requireRoomMember, requireRoomOwner } from '../middleware/roomMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validateBody(['name']), createRoom);

router.get('/', getMyRooms);

router.post('/join', validateBody(['inviteCode']), joinRoom);

router.get('/:roomId', requireRoomMember, getRoom);

router.post('/:roomId/invite-code', requireRoomMember, requireRoomOwner, regenerateInviteCode);

router.post('/:roomId/leave', requireRoomMember, leaveRoom);

export default router;
