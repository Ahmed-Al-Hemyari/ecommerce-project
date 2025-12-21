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


    // // Delete
    softDelete: (data) => api.patch('/categories/delete', {
        ids: data,
    }),
    restore: (data) => api.patch(`/categories/restore`, {
        ids: data,
    }),
    hardDelete : (data) => api.delete(`/categories/delete`, {
        data: {
            ids: data
        }
    }),
}

export default categoryService;