import api from "./api";

export const authService = {
  loginByPhone: (data) => api.post("/login-phone", data),
  loginByEmail: (data) => api.post("/login-email", data),
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile/update", data),
  changePassword: (data) => api.put("/profile/change-password", data),
  checkAuthAndAdmin : () => api.get("/check-admin"),
  logout: () => api.post("/logout"),
};

export default authService;
