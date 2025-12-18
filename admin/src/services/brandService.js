import api from "./api";

export const brandService = {
    getBrands : (search, deleted, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (deleted !== undefined) params.deleted = deleted;
        
        if (limit !== undefined && limit !== null) {
            if (page) params.page = page;
            params.limit = limit;
        }

        return api.get("/brands", { params });
    },
    getBrand : (id) => api.get(`/brands/${id}`),
    createBrand : (data) => api.post("/brands", data),
    updateBrand : (id, data) => api.put(`/brands/${id}`, data),
    deleteBrand : (id) => api.patch(`/brands/${id}`),
    restoreBrand: (id) => api.patch(`/brands/restore/${id}`),

    // Bulk
    restoreMany: (data) => api.patch(`/brands/bulk-restore`, {
        ids: data,
    }),
    deleteMany: (data) => api.patch('/brands/bulk-delete', {
        ids: data,
    })
}

export default brandService;
