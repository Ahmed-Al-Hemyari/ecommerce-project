import React, { useState, useEffect } from 'react';
import defaultProductImage from '@/assets/default-product-image.png';
import MainLayout from "@/layouts/MainLayout";
import { AiOutlineDelete } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    readLocalStorageItem
} from '@/services/LocalStorageFunctions';
import {
    productService,
    authService
} from '../services/api-calls';
import Swal from 'sweetalert2';
import { useSnackbar } from 'notistack';
import Spinner from '../components/Spinner';

const url = import.meta.env.VITE_IMAGES_BACKEND_URL;

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // unified loading state
    const navigate = useNavigate();
    const location = useLocation();

    // ---------------------
    // AUTH CHECK
    // ---------------------
    const checkAuth = async () => {
        try {
            const profile = await authService.getProfile();
            setUser(profile);
        } catch (err) {
            console.warn('Auth check failed:', err);
            setUser(null);
            enqueueSnackbar("You need to login first", { variant: 'warning' });
            navigate('/login'); // redirect if not authenticated
        }
    };

    // ---------------------
    // LOAD CART ITEMS
    // ---------------------
    const loadCart = async () => {
        const items = readLocalStorageItem('cart') || [];

        const fullCart = await Promise.all(
            items.map(async (item) => {
                try {
                    const res = await productService.getProduct(item._id);
                    const product = res.data;
                    return {
                        ...product,
                        price: Number(product.price) || 0,
                        quantity: item.quantity,
                    };
                } catch (error) {
                    console.error("Error fetching product:", error);
                    return null;
                }
            })
        );

        setCartItems(fullCart.filter(Boolean));
    };

    // ---------------------
    // HANDLE QUANTITY
    // ---------------------
    const handleQuantity = (id, type) => {
        setCartItems(prevCart => {
            let updatedCart;

            if (type === 'inc') {
                updatedCart = prevCart.map(item =>
                    item._id === id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = prevCart
                    .map(item =>
                        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
                    )
                    .filter(item => item.quantity > 0);
            }

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    // ---------------------
    // REMOVE ITEM
    // ---------------------
    const handleRemove = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this product?",
            text: "You won’t be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#82E2BB"
        });

        if (!result.isConfirmed) return;

        setCartItems(prevCart => {
            const updatedCart = prevCart.filter(item => item._id !== id);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    // ---------------------
    // INITIAL LOAD
    // ---------------------
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-dark-gray', '#333333');
        root.style.setProperty('--color-light-gray', '#CDCDCD');
        root.style.setProperty('--color-green', '#82E2BB');

        if (location.state?.message) {
            enqueueSnackbar(location.state.message, { variant: location.state.status });
        }

        const init = async () => {
            setLoading(true); // start spinner
            await checkAuth(); // check user
            await loadCart();  // load cart items
            setLoading(false); // stop spinner after both complete
        };

        init();
    }, [location.state]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // ---------------------
    // SHOW SPINNER WHILE LOADING
    // ---------------------
    if (loading) return (
        <MainLayout page='products'>
            <div className="flex justify-center items-center min-h-[70vh]">
                <Spinner />
            </div>
        </MainLayout>
    );

    return (
        <MainLayout page='products'>
            <div className="min-h-screen bg-gray-50 text-(--color-dark-gray)">
                <div className="max-w-7xl mx-auto p-6">
                    <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
                    {cartItems.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🛒</div>
                            <p className="text-lg mb-4">Your cart is empty.</p>
                            <Link to={'/products'}>
                                <button className="px-6 py-3 rounded-md bg-(--color-green) text-(--color-dark-gray) font-semibold cursor-pointer">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Cart Items List */}
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                                        <img 
                                            src={item.image ? `${url}${item.image}` : defaultProductImage} 
                                            alt={item.title} 
                                            className="w-24 h-24 object-cover rounded" 
                                        />
                                        <div className="ml-4 flex-1">   
                                            <h2 className="font-medium text-(--color-dark-gray)">{item.title}</h2>
                                            <p className="text-gray-500">${Number(item.price || 0).toFixed(2)}</p>
                                            <div className="flex items-center mt-2 gap-2">
                                                <button className="px-2 py-1 border border-(--color-light-gray) rounded" onClick={() => handleQuantity(item._id, 'dec')}>-</button>
                                                <span className="px-3 py-1 border border-(--color-light-gray) rounded">{item.quantity}</span>
                                                <button className="px-2 py-1 border border-(--color-light-gray) rounded" onClick={() => handleQuantity(item._id, 'inc')}>+</button>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="font-semibold">${(Number(item.price || 0) * item.quantity)?.toFixed(2)}</p>
                                            <button className="mt-2 text-red-500 hover:underline cursor-pointer" onClick={() => handleRemove(item._id)}><AiOutlineDelete size={20}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Box */}
                            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Shipping</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="border-t border-(--color-light-gray) mt-2 pt-2 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${(subtotal + 5).toFixed(2)}</span>
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <Link to={'/checkout'}>
                                        <button className="px-4 w-full py-3 rounded-md bg-(--color-green) text-(--color-dark-gray) font-semibold">Proceed to Checkout</button>
                                    </Link>
                                    <Link to={'/products'}>
                                        <button className="px-4 w-full py-3 rounded-md border border-(--color-dark-gray)">Continue Shopping</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Cart;
