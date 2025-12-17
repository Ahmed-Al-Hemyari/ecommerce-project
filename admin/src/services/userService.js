import api from "./api";

export const userService = {
    getUsers: (search, role, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (role) params.role = role;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/users", { params });
    },
    getUser : (id) => api.get(`/users/${id}`),
    createUser : (data) => api.post("/users", data),
    updateUser : (id, data) => api.put(`/users/${id}`, data),
    deleteUser : (id) => api.delete(`/users/${id}`),
    deleteMany: (data) => api.delete(`/users/bulk-delete`, {
        data: {
            ids: data,
        }
    }),
    grantAdmin: (data) => api.put('users/bulk-update', {
        ids: data,
        updates: { role: 'admin' }
    }),
    revokeAdmin: (data) => api.put('users/bulk-update', {
        ids: data,
        updates: { role: 'user' }
    }),
}

export default userService; 