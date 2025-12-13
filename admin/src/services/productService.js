import api from "./api";

export const productService = {
    getProducts: (filters) => {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.brand) params.brand = filters.brand;

        return api.get("/products", { params });
    },
    getProduct : (id) => api.get(`/products/${id}`),
    createProduct : (data) => api.post("/products", data),
    updateProduct : (id, data) => api.put(`/products/${id}`, data),
    deleteProduct : (id) => api.delete(`/products/${id}`),
}

export default productService;