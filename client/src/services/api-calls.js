import api from "./api";

export const authService = {
  register: (data) => api.post("/register", data),
  loginByPhone: (data) => api.post("/login-phone", data),
  loginByEmail: (data) => api.post("/login-email", data),
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile/update", data),
  changePassword: (data) => api.put("/profile/change-password", data),
  checkAuth : () => api.get("/check-auth"),
  logout : () => api.post("/logout"),
};

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
    createOrder: (data) => api.post("/orders", data),
    cancelOrder: (id) => api.put(`/orders/bulk-update`, {
        ids: [id],
        updates: { status: 'Cancelled' }
    }),
}