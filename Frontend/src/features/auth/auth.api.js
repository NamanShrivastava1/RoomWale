import api from "../../lib/api.js";
export const authApi = {
  me: () => api.get("/auth/me"),
  login: (body) => api.post("/auth/login", body),
  register: (body) => api.post("/auth/register", body),
  logout: () => api.post("/auth/logout"),
};
