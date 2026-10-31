import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import taskRoutes from './routes/task.routes.js';

import morganLogger from './loggers/morgan.logger.js';
import ApiError from './utils/ApiError.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { config } from './config/config.js';

const app = express();

app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(morganLogger);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Roommate Tracker API',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Roommate Tracker API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api', taskRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorMiddleware);

export default app;
