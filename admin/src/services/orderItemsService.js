import api from "./api";

export const orderItemsService = {
    getOrderItem: (id) => api.get(`/order-items/${id}`),
    createOrderItem: (data) => api.post('/order-items', data),
    updateOrderItem: (id, data) => api.put(`/order-items/${id}`, data),
    delete: (id) => api.delete(`/order-items/delete`, {
        data: { ids: [id] }
    }),
};