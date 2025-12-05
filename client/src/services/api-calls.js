import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Auth
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {email, password});
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Login failed");
        }
        throw new Error("Something went wrong. Please try again");
    }
}

export const register = async (name, email, phone, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            name, email, phone, password
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Login failed");
        }
        throw new Error("Something went wrong. Please try again");
    }
}

// Products
export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products: ', error);
        return [];
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product: ', error);
        return [];
    }
}

// Categories
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};