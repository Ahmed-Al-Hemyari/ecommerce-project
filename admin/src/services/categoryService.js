import api from "./api";

export const categoryService = {
    getCategories : (search, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/categories", { params });
    },
    getCategory : (id) => api.get(`/categories/${id}`),
    createCategory : (data) => api.post("/categories", data),
    updateCategory : (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory : (id) => api.delete(`/categories/${id}`),
}

export default categoryService;