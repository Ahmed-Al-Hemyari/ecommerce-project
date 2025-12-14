import api from "./api";

export const authService = {
  register: (data) => api.post("/register", data),
  loginByPhone: (data) => api.post("/login-phone", data),
  loginByEmail: (data) => api.post("/login-email", data),
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile/update", data),
  changePassword: (data) => api.put("/profile/change-password", data),
  checkAuth : () => api.get("/check-auth"),
};

export const brandService = {
    getBrands : () => api.get("/brands"),
}

export const categoryService = {
    getCategories : () => api.get("/categories"),
}

export const productService = {
    getProducts: ({search, category, brand, minPrice, maxPrice, page} = {}) => {
        const params = {};

        if(search) params.search = search;
        if(category) params.category = category;
        if(brand) params.brand = brand;
        if(minPrice) params.minPrice = minPrice;
        if(maxPrice) params.maxPrice = maxPrice;
        if(page) params.page = page;

        return api.get("/products", { params });
    },
    getProduct: (id) => api.get(`/products/${id}`),
}

export const orderService = {
    getOrders: () => api.get("/orders/user"),
    createOrder: (data) => api.post("/orders", data),
    cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
}

// import axios from 'axios';
// import { readLocalStorageItem } from './LocalStorageFunctions';
// import { useNavigate } from 'react-router-dom';
// const API_URL = import.meta.env.VITE_BACKEND_URL;

// // Auth
// export const loginByEmail = async (email, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/login-email`, {email, password});
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || "Login failed");
//         }
//         throw new Error("Something went wrong. Please try again");
//     }
// }

// export const loginByPhone = async (phone, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/login-phone`, {phone, password});
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || "Login failed");
//         }
//         throw new Error("Something went wrong. Please try again");
//     }
// }

// export const register = async (name, email, phone, password) => {
//     try {
//         const response = await axios.post(`${API_URL}/register`, {
//             name, email, phone, password
//         });
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || "Login failed");
//         }
//         throw new Error("Something went wrong. Please try again");
//     }
// }

// export const isAuth = async () => {
//     const token = localStorage.getItem('token');

//     if (!token) return false;

//     try {
//         const res = await axios.get(`${API_URL}/check-auth`, {
//             headers: { Authorization: `Bearer ${token}`}
//         });

//         return res.data.authenticated || false;

//     } catch (error) {
//         return false;
//     }
// }

// export const profile = async () => {
//     const token = localStorage.getItem('token');

//     if (!token) return null;
//     try {
//         const res = await axios.get(`${API_URL}/profile`, {
//             headers: { Authorization: `Bearer ${token}`}
//         });

//         return res.data.user || null;

//     } catch (error) {
//         return null;
//     }
// }

// export const editProfile = async (name, email, phone) => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.put(
//             `${API_URL}/profile/update`,
//             { name, email, phone },
//             { headers: { Authorization: `Bearer ${token}`} }
//         );
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || "Update Failed");
//         }
//         throw new Error("Something went wrong. Please try again");
//     }
// }

// export const changePassword = async (oldPassword, newPassword) => {
//     const token = localStorage.getItem('token');
//     try {
//         const response = await axios.put(
//             `${API_URL}/profile/change-password`,
//             { oldPassword, newPassword },
//             { headers: { Authorization: `Bearer ${token}`} }
//         );
//         localStorage.setItem("user", JSON.stringify(response.data.user));
//         return response.data;
//     } catch (error) {
//         if (error.response) {
//             throw new Error(error.response.data.message || "Update Failed");
//         }
//         throw new Error("Something went wrong. Please try again");
//     }
// }

// // Products
// export const fetchProducts = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/products`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching products: ', error);
//         return [];
//     }
// };

// export const fetchProductById = async (id) => {
//     try {
//         const response = await axios.get(`${API_URL}/products/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching product: ', error);
//         return [];
//     }
// }

// // Categories
// export const fetchCategories = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/categories`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         return [];
//     }
// };

// // Brands
// export const fetchBrands = async () => {
//     try {
//         const response = await axios.get(`${API_URL}/brands`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching brands:', error);
//         return [];
//     }
// };

// // Orders
// export const createOrder = async (userId, cartItems, shipping) => {
//     const token = localStorage.getItem('token');

//     const orderItems = cartItems.map((item) => ({
//         product: item._id,
//         quantity: item.quantity,
//         price: item.price
//     }))

//     try {
//         const response = await axios.post(
//             `${API_URL}/orders`,
//             { 
//                 orderItems: orderItems, 
//                 user: userId,
//                 shipping: shipping,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//         );

//         return response.data; // return created order
//     } catch (error) {
//         console.error("Error creating order:", error.response || error.message);
//         throw error; // propagate error to caller
//     }
// };

// export const getOrders = async () => {
//     const token = localStorage.getItem('token');
    
//     try {
//         const response = await axios.get(`${API_URL}/orders/user`, {
//             headers: { Authorization: `Bearer ${token}`}
//         });
//         // console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching orders: ', error);
//         return [];
//     }
// }

// export const cancelOrderById = async (orderId) => {
//     const token = localStorage.getItem('token');

//     try {
//         const response = await axios.put(
//             `${API_URL}/orders/${orderId}/cancel`,
//             {},
//             {
//                 headers: { Authorization: `Bearer ${token}`},
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Error cancelling order:", error.response || error.message);
//         throw error;
//     }
// }