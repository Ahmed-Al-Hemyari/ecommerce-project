import api from "./api";

export const orderService = {
    getOrders: ({search, user, product, status, paid, page, limit}) => {
        const params = {};
        if (search) params.search = search;
        if (user) params.user = user;
        if (product) params.product = product;
        if (status !== undefined && status !== null) params.status = status;
        if (paid !== undefined && paid !== null) params.paid = paid;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/orders", { params });
    },
    getOrder : (id) => api.get(`/orders/${id}`),
    createOrder : (data) => api.post("/orders", data),
    updateOrder : (id, data) => api.put(`/orders/${id}`, data),

    // Hard Delete
    hardDelete: (data) => api.delete('/orders/delete', {
        data: {
            ids: data
        }
    }),

    // Status
    updateToPending: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'pending' }
    }),
    updateToProcessing: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'processing' }
    }),
    updateToShipped: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'shipped' }
    }),
    updateToDelivered: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'delivered' }
    }),
    updateToCancelled: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { status: 'cancelled' }
    }),
    
    // Paid
    updateToPaid: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { is_paid: true, status: 'processing' }
    }),
    updateToNotPaid: (data) => api.patch('/orders/bulk-update', {
        ids: data,
        updates: { is_paid: false, paid_at: null }
    }),
}

export default orderService;