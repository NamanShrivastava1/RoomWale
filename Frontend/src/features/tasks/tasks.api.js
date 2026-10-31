import api from "../../lib/api.js";
// If your backend uses different paths, change them only in this file.
export const tasksApi = {
  list: (roomId) => api.get(`/rooms/${roomId}/tasks`),
  create: (roomId, body) => api.post(`/rooms/${roomId}/tasks`, body),
  complete: (taskId, body) => api.post(`/tasks/${taskId}/completions`, body),
  history: (roomId, params = {}) =>
    api.get(`/rooms/${roomId}/completions`, { params }),
  stats: (roomId, params = {}) => api.get(`/rooms/${roomId}/stats`, { params }),
  update: (taskId, body) => api.patch(`/tasks/${taskId}`, body),
  deactivate: (taskId) => api.delete(`/tasks/${taskId}`),
};
