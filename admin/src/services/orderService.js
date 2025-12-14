import api from "./api";

export const orderService = {
    getOrders: (search, status, payed, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (payed) params.payed = payed;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/orders", { params });
    },
    getOrder : (id) => api.get(`/orders/${id}`),
    createOrder : (data) => api.post("/orders", data),
    updateOrder : (id, data) => api.put(`/orders/${id}`, data),
    deleteOrder : (id) => api.delete(`/orders/${id}`),
}

export default orderService;