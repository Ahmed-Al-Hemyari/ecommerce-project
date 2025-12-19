import api from "./api";

export const categoryService = {
    getCategories : (search, deleted, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (deleted !== undefined) params.deleted = deleted;

        if (limit !== undefined && limit !== null) {
            if (page) params.page = page;
            params.limit = limit;
        }

        return api.get("/categories", { params });
    },
    getCategory : (id) => api.get(`/categories/${id}`),
    createCategory : (data) => api.post("/categories", data),
    updateCategory : (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory : (id) => api.patch(`/categories/${id}`),
    restoreCategory : (id) => api.patch(`/categories/restore/${id}`),
    hardDelete : (data) => api.delete(`/categories`, {
        data: {
            ids: data
        }
    }),
    deleteMany: (data) => api.patch('/categories/bulk-delete', {
        ids: data,
    }),
    restoreMany: (data) => api.patch('/categories/bulk-restore', {
        ids: data,
    })
}

export default categoryService;