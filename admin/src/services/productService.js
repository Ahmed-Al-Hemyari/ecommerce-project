import api from "./api";

export const productService = {
    getProducts: (search, category, brand, deleted, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (deleted !== undefined) params.deleted = deleted;

        return api.get("/products", { params });
    },
    getProduct : (id) => api.get(`/products/${id}`),
    createProduct : (data) => api.post("/products", data),
    updateProduct : (id, data) => api.put(`/products/${id}`, data),
    deleteProduct : (id) => api.patch(`/products/${id}`),
    restoreProduct : (id) => api.patch(`/products/restore/${id}`),
    restoreMany: (data) => api.patch('/products/bulk-restore', {
        ids: data,
    }),
}

export default productService;