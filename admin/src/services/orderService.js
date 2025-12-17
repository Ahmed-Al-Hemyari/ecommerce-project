import api from "./api";

export const orderService = {
    getOrders: (search, user, status, payed, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (user) params.user = user;
        if (status !== undefined && status !== null) params.status = status;
        if (payed !== undefined ) params.payed = payed;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/orders", { params });
    },
    getOrder : (id) => api.get(`/orders/${id}`),
    createOrder : (data) => api.post("/orders", data),
    updateOrder : (id, data) => api.put(`/orders/${id}`, data),
    // Status
    updateToPending: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'Pending' }
    }),
    updateToProcessing: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'Processing' }
    }),
    updateToShipped: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'Shipped' }
    }),
    updateToDelivered: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'Delivered' }
    }),
    updateToCancelled: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'Cancelled' }
    }),
    // Payed
    updateToPayed: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { payed: true }
    }),
    updateToNotPayed: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { payed: false }
    }),
}

export default orderService;