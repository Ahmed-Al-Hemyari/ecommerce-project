import api from "./api";

export const userService = {
    getUsers: (search, role) => {
        const params = {};
        if (search) params.search = search;
        if (role) params.role = role;

        return api.get("/users", { params });
    },
    getUser : (id) => api.get(`/users/${id}`),
    createUser : (data) => api.post("/users", data),
    updateUser : (id, data) => api.put(`/users/${id}`, data),
    deleteUser : (id) => api.delete(`/users/${id}`),
}

export default userService; 