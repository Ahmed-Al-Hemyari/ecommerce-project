import api from "./api";

export const productService = {
    getProducts : (search) => api.get("/products", {
        params: search ? { search } : {}
    }),
    getProduct : (id) => api.get(`/products/${id}`),
    createProduct : (data) => api.post("/products", data),
    updateProduct : (id, data) => api.put(`/products/${id}`, data),
    deleteProduct : (id) => api.delete(`/products/${id}`),
}

export default productService;