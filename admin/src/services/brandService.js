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
    
    // // Delete
    softDelete: (data) => api.patch('/brands/delete', {
        ids: data,
    }),
    restore: (data) => api.patch(`/brands/restore`, {
        ids: data,
    }),
    hardDelete : (data) => api.delete(`/brands/delete`, {
        data: {
            ids: data
        }
    }),
}

export default brandService;
