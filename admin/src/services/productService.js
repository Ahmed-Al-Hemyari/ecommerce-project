import api from "./api";

export const productService = {
    getProducts: (search, category, brand, stock, deleted, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (brand) params.brand = brand;
        if (stock) params.stock = stock;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (deleted !== undefined) params.deleted = deleted;

        return api.get("/products", { params });
    },
    getProduct : (id) => api.get(`/products/${id}`),
    createProduct : (data) => api.post("/products", data),
    updateProduct : (id, data) => api.post(`/products/${id}`, data),
    addStock : (id, stock) => api.patch(`/products/add-stock/${id}`, { stock }),
   
    
    // // Delete
    softDelete: (data) => api.patch('/products/delete', {
        ids: data,
    }),
    restore: (data) => api.patch(`/products/restore`, {
        ids: data,
    }),
    hardDelete : (data) => api.delete(`/products/delete`, {
        data: {
            ids: data
        }
    }),
}

export default productService;