import api from "./api";

export const brandService = {
    getBrands : (search, page, limit) => {
        const params = {};
        if (search) params.search = search;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return api.get("/brands", { params });
    },
    getBrand : (id) => api.get(`/brands/${id}`),
    createBrand : (data) => api.post("/brands", data),
    updateBrand : (id, data) => api.put(`/brands/${id}`, data),
    deleteBrand : (id) => api.delete(`/brands/${id}`),
}

export default brandService;
