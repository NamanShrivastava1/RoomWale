import { Router } from 'express';

import {
  createTask,
  getRoomTasks,
  updateTask,
  deactivateTask,
  completeTask,
  getCompletionsByDate,
  getRoomStats,
} from '../controllers/task.controller.js';

import authMiddleware from '../middleware/authMiddleware.js';
import validateBody from '../middleware/validateMiddleware.js';

import { requireRoomMember, requireRoomOwner } from '../middleware/roomMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Room-specific routes
router.post(
  '/rooms/:roomId/tasks',
  requireRoomMember,
  requireRoomOwner,
  validateBody(['title', 'description', 'points']),
  createTask
);

router.get('/rooms/:roomId/tasks', requireRoomMember, getRoomTasks);

router.get('/rooms/:roomId/completions', requireRoomMember, getCompletionsByDate);

router.get('/rooms/:roomId/stats', requireRoomMember, getRoomStats);

// Individual task routes
router.patch('/tasks/:taskId', validateBody(['title', 'description', 'points']), updateTask);

router.delete('/tasks/:taskId', deactivateTask);

router.post('/tasks/:taskId/completions', validateBody(['completionDate', 'note']), completeTask);

export default router;
