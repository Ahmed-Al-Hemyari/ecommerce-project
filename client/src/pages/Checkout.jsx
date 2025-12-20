import React, { useState, useEffect } from "react";
import MainLayout from '../layouts/MainLayout';
import { readLocalStorageItem } from "../services/LocalStorageFunctions";
import { countries } from '../services/countries'
import { 
    orderService
 } from "../services/api-calls";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Checkout = () => {
  const user = readLocalStorageItem('user');
  const userId = user?.id;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [cart, setCart] = useState([]);
  const [shippingData, setShippingData] = useState({
    address1: "",
    address2: "",
    city: "",
    zip: "",
    country: "",
    paymentMethod: "cod",
  });

  // Errors
  const [formError, setFormError] = useState("");
  const [zipError, setZipError] = useState("");

  useEffect(() => {
    const items = readLocalStorageItem('cart');
    setCart(items);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
        !shippingData.address1
        || !shippingData.city
        || !shippingData.zip
        || !shippingData.country
        || !shippingData.paymentMethod
    ) {
        setFormError("Fill all fields with *");
        return;
    }

    const zipRegex = /^[A-Za-z0-9\- ]{3,10}$/;
    if (!zipRegex.test(shippingData.zip)) {
        setZipError("Invalid zip code!!");
        return;
    }

    try {
        const orderItems = cart.map(item => ({
            product: item._id,
            quantity: item.quantity
        }));
        console.log(orderItems);
        const response = await orderService.createOrder({userId: userId, orderItems, shipping: shippingData});
        localStorage.setItem('cart', JSON.stringify([]));
        navigate("/", {
            state: {
                message: "Order submitted successfully",
                status: "success"
            }
        });
    } catch (error) {
        console.log("Failed to submit order, error: ", error);
        enqueueSnackbar(error || "Failed to submit order!", { variant: 'error'});
    }
  };

    return (
    <MainLayout>
        <div className="min-h-screen bg-gray-100 p-4 md:p-10">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col md:flex-row md:gap-6">
            {/* Left Column: Shipping & Billing */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0">

            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <p className="text-red-500">{formError}</p>
            {/* FULL PAGE FORM STARTS HERE */}
            <form className="space-y-4" onSubmit={handlePlaceOrder}>
                <label htmlFor="address1" className="flex gap-1 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="address1"
                    placeholder="Address Line 1"
                    value={shippingData.address1}
                    onChange={handleChange}
                    className={`w-full border ${formError && 'border-red-500'} rounded px-3 py-2`}
                />

                <label htmlFor="address2" className="flex gap-1 mb-2">
                    Address Line 2 <span className="text-red-500"></span>
                </label>
                <input
                    type="text"
                    name="address2"
                    placeholder="Address Line 2 (Optional)"
                    value={shippingData.address2}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2`}
                />

                <div className="flex gap-2">
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="city" className="flex gap-1 mb-2">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={shippingData.city}
                            onChange={handleChange}
                            className={`w-full border ${formError && 'border-red-500'} rounded px-3 py-2`}
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor="zip" className="flex gap-1 mb-2">
                            ZIP code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="zip"
                            placeholder="ZIP Code"
                            value={shippingData.zip}
                            onChange={handleChange}
                            className={`w-full border ${formError || zipError && 'border-red-500'} rounded px-3 py-2`}
                        />
                        <p className="text-red-500 text-sm mt-2">{zipError}</p>
                    </div>
                </div>

                <label htmlFor="country" className="flex gap-1 mb-2">
                    Country <span className="text-red-500">*</span>
                </label>
                <select
                    name="country"
                    value={shippingData.country}
                    onChange={handleChange}
                    className={`w-full border ${formError && 'border-red-500'} rounded px-3 py-2`}
                >
                    <option value="" disabled>Select a country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                        {country}
                        </option>
                    ))}
                </select>

                {/* Right Column stays inside form visually */}
                <div className="w-full bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0">

                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                    <div key={item._id} className="flex justify-between">
                        <span>{item.title} x {item.quantity}</span>
                        <span>${item.price * item.quantity}</span>
                    </div>
                    ))}
                </div>

                <hr className="my-2" />

                <div className="flex justify-between font-semibold">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                </div>

                <div className="flex justify-between font-semibold">
                    <span>Shipping</span>
                    <span>${shipping}</span>
                </div>

                <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>${total}</span>
                </div>

                <h3 className="font-semibold mb-2">Payment Method</h3>

                <label className="flex items-center gap-2 mb-1">
                    <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={shippingData.paymentMethod === "card"}
                    onChange={handleChange}
                    disabled
                    />
                    Credit/Debit Card
                </label>

                <label className="flex items-center gap-2 mb-1">
                    <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={shippingData.paymentMethod === "paypal"}
                    onChange={handleChange}
                    disabled
                    />
                    PayPal
                </label>

                <label className="flex items-center gap-2 mb-4">
                    <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={shippingData.paymentMethod === "cod"}
                    onChange={handleChange}
                    />
                    Cash on Delivery
                </label>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-(--color-green) text-black font-bold py-2 rounded hover:bg-green-700 transition"
                >
                    Place Order
                </button>
                </div>
            </form>
            {/* END OF FORM */}
            </div>

        </div>
        </div>
    </MainLayout>
    );
};

export default Checkout;