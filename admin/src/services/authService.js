import api from "./api";

export const authService = {
  loginByPhone: (data) => api.post("/login-phone", data),
  loginByEmail: (data) => api.post("/login-email", data),
  checkAuthAndAdmin : () => api.get("/check-admin"),
};

export default authService;
