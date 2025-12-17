import api from "./api";

export const categoryService = {
    getCategories : (search, page, limit) => {
        const params = {};
        if (search) params.search = search;

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
    deleteMany: (data) => api.patch('/categories/bulk-delete', {
        ids: data,
    })
}

export default categoryService;