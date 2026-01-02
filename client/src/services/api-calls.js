import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  loginByPhone: (data) => api.post("/auth/login-phone", data),
  loginByEmail: (data) => api.post("/auth/login-email", data),
  getProfile: () => api.get("/auth/profile"),
  setDefault: (shippingId) => api.patch(`/auth/shippings/${shippingId}/set-default`),
  updateProfile: (data) => api.put("/auth/profile/update", data),
  changePassword: (data) => api.put("/auth/profile/change-password", data),
  checkAuth : () => api.get("/auth/check-auth"),
  logout : () => api.post("/auth/logout"),
};

export const shippingService = {
    getShipping: (id) => api.get(`/shippings/${id}`),
    createShipping: (data) => api.post("/shippings", data),
    updateShipping: (id, data) => api.put(`/shippings/${id}`, data),
    deleteShipping: (id) => api.delete(`/shippings/${id}`),
}

export const brandService = {
    getBrands : () => api.get("/brands"),
}

export const categoryService = {
    getCategories : () => api.get("/categories"),
}

export const productService = {
    getProducts: ({search, category, brand, minPrice, maxPrice, page, limit=10} = {}) => {
        const params = {};

        if(search) params.search = search;
        if(category) params.category = category;
        if(brand) params.brand = brand;
        if(minPrice) params.minPrice = minPrice;
        if(maxPrice) params.maxPrice = maxPrice;
        if(page) params.page = page;
        if(limit) params.limit = limit;

        return api.get("/products", { params });
    },
    getProduct: (id) => api.get(`/products/${id}`),
}

export const orderService = {
    getOrders: () => api.get("/orders/user"),
    createOrder: (data) => api.post("/orders/from-cart", data),
    cancelOrder: (id) => api.patch(`/orders/bulk-update`, {
        ids: [id],
        updates: { status: 'cancelled' }
    }),
}