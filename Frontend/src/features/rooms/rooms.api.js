import api from "../../lib/api.js";
// Keep endpoint changes here if your backend route names differ.
export const roomsApi = {
  list: () => api.get("/rooms"),
  create: (body) => api.post("/rooms", body),
  join: (inviteCode) => api.post("/rooms/join", { inviteCode }),
  get: (id) => api.get(`/rooms/${id}`),
  leave: (id) => api.post(`/rooms/${id}/leave`),
  regenerateInvite: (id) => api.post(`/rooms/${id}/invite-code`),
};
