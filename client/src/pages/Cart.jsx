import React, { useState, useEffect } from 'react'
import defaultProductImage from '@/assets/default-product-image.png'
import MainLayout from "@/layouts/MainLayout";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

const Cart = () => {
    useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-dark-gray', '#333333');
    root.style.setProperty('--color-light-gray', '#CDCDCD');
    root.style.setProperty('--color-green', '#82E2BB');
    }, []);


    // Dummy cart items
    const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Wireless Headphones', price: 79.99, quantity: 1, img: defaultProductImage },
    { id: 2, title: 'Classic Sneakers', price: 59.99, quantity: 2, img: defaultProductImage },
    ]);


    const handleQuantity = (id, type) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1) } : item));
    };


    const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    };


    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return (
        <MainLayout page='products'>

        <div className="min-h-screen bg-gray-50 text-(--color-dark-gray)">
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-lg mb-4">Your cart is empty.</p>
                    <button className="px-6 py-3 rounded-md bg-(--color-green) text-(--color-dark-gray) font-semibold">Start Shopping</button>
                </div>
                ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Cart Items List */}
                    <div className="md:col-span-2 space-y-4">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                        <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded" />
                        <div className="ml-4 flex-1">
                            <h2 className="font-medium text-(--color-dark-gray)">{item.title}</h2>
                            <p className="text-gray-500">${item.price.toFixed(2)}</p>
                            <div className="flex items-center mt-2 gap-2">
                            <button className="px-2 py-1 border border-(--color-light-gray) rounded" onClick={() => handleQuantity(item.id, 'dec')}>-</button>
                            <span className="px-3 py-1 border border-(--color-light-gray) rounded">{item.quantity}</span>
                            <button className="px-2 py-1 border border-(--color-light-gray) rounded" onClick={() => handleQuantity(item.id, 'inc')}>+</button>
                            </div>
                        </div>
                        <div className="ml-4 text-right">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <button className="mt-2 text-red-500 hover:underline cursor-pointer" onClick={() => handleRemove(item.id)}><AiOutlineDelete size={20}/></button>
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
                        <Link to={''}>
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
    )
}

export default Cart
