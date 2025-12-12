import api from "./api";

export const userService = {
    getUsers : (search) => api.get("/users", {
        params: search ? { search } : {}
    }),
    getUser : (id) => api.get(`/users/${id}`),
    createUser : (data) => api.post("/users", data),
    updateUser : (id, data) => api.put(`/users/${id}`, data),
    deleteUser : (id) => api.delete(`/users/${id}`),
}

export default userService;