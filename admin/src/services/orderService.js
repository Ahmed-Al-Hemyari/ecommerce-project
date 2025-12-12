import api from "./api";

export const orderService = {
    getOrders : (search) => api.get("/orders", {
        params: search ? { search } : {}
    }),
    getOrder : (id) => api.get(`/orders/${id}`),
    createOrder : (data) => api.post("/orders", data),
    updateOrder : (id, data) => api.put(`/orders/${id}`, data),
    deleteOrder : (id) => api.delete(`/orders/${id}`),
}

export default orderService;