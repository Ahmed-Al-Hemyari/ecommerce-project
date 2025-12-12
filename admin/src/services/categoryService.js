import api from "./api";

export const categoryService = {
    getCategories : (search) => api.get("/categories", {
        params: search ? { search } : {}
    }),
    getCategory : (id) => api.get(`/categories/${id}`),
    createCategory : (data) => api.post("/categories", data),
    updateCategory : (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory : (id) => api.delete(`/categories/${id}`),
}

export default categoryService;