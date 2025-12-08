import api from "./api";

export const userService = {
    getUsers : () => api.get("/users"),
    getUser : (id) => api.get(`/users/${id}`),
    createUser : (data) => api.post("/users", data),
    updateUser : (id, data) => api.put(`/users/${id}`, data),
    deleteUser : (id) => api.delete(`/users/${id}`),
}

export default userService;