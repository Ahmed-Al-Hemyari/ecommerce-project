import api from "./api";

export const authService = {
  loginByPhone: (data) => api.post("/auth/login-phone", data),
  loginByEmail: (data) => api.post("/auth/login-email", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile/update", data),
  changePassword: (data) => api.put("/auth/profile/change-password", data),
  checkAuthAndAdmin : () => api.get("/auth/check-admin"),
  logout: () => api.post("/auth/logout"),
};

export default authService;
