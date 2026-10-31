import { Router } from 'express';

import { register, login, logout, getCurrentUser } from '../controllers/auth.controller.js';

import authMiddleware from '../middleware/authMiddleware.js';
import validateBody from '../middleware/validateMiddleware.js';

const router = Router();

router.post('/register', validateBody(['name', 'email', 'password']), register);

router.post('/login', validateBody(['email', 'password']), login);

router.post('/logout', logout);

router.get('/me', authMiddleware, getCurrentUser);

export default router;
