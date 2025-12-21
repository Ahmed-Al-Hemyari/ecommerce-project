import api from "./api";

export const userService = {
    getUsers: (search, role, deleted, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (role) params.role = role;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (deleted !== undefined) params.deleted = deleted;

        return api.get("/users", { params });
    },
    getUser : (id) => api.get(`/users/${id}`),
    createUser : (data) => api.post("/users", data),
    updateUser : (id, data) => api.put(`/users/${id}`, data),
    
    
    // // Delete
    softDelete: (data) => api.patch('/users/delete', {
        ids: data,
    }),
    restore: (data) => api.patch(`/users/restore`, {
        ids: data,
    }),
    hardDelete : (data) => api.delete(`/users/delete`, {
        data: {
            ids: data
        }
    }),

    // Update
    grantAdmin: (data) => api.patch('users/bulk-update', {
        ids: data,
        updates: { role: 'admin' }
    }),
    revokeAdmin: (data) => api.patch('users/bulk-update', {
        ids: data,
        updates: { role: 'user' }
    }),
}

export default userService; 