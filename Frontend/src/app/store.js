import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice.js';
import roomsReducer from '../features/rooms/rooms.slice.js';
import tasksReducer from '../features/tasks/tasks.slice.js';
export const store = configureStore({ reducer: { auth: authReducer, rooms: roomsReducer, tasks: tasksReducer } });
