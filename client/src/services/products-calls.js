import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};