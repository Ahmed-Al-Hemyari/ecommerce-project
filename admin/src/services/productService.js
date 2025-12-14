import api from "./api";

export const productService = {
    getProducts: (search, category, brand, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/products", { params });
    },
    getProduct : (id) => api.get(`/products/${id}`),
    createProduct : (data) => api.post("/products", data),
    updateProduct : (id, data) => api.put(`/products/${id}`, data),
    deleteProduct : (id) => api.delete(`/products/${id}`),
}

export default productService;