import api from "./api";

export const brandService = {
    getBrands : (search) => api.get("/brands", {
        params: search ? { search } : {}
    }),
    getBrand : (id) => api.get(`/brands/${id}`),
    createBrand : (data) => api.post("/brands", data),
    updateBrand : (id, data) => api.put(`/brands/${id}`, data),
    deleteBrand : (id) => api.delete(`/brands/${id}`),
}

export default brandService;
