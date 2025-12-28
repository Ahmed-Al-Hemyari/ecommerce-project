import api from "./api";

export const shippingService = {
    // getShippings : (params) => api.get("/shippings", { params }),
    getShipping : (id) => api.get(`/shippings/${id}`),
    createShipping : (data) => api.post("/shippings", data),
    updateShipping : (id, data) => api.put(`/shippings/${id}`, data),
    makeDefault : (id) => api.patch(`/shippings/${id}`),
    delete: (id) => api.delete(`/shippings/${id}`),
};