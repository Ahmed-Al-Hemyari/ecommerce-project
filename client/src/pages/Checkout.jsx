// pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { readLocalStorageItem } from "../services/LocalStorageFunctions";
import { authService, orderService } from "../services/api-calls";
import ShippingOption from "../components/ShippingOption";
import Swal from "sweetalert2";
import Spinner from "../components/Spinner";

const Checkout = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = readLocalStorageItem("user");

  const [cart, setCart] = useState([]);
  const [shippings, setShippings] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loadingFetch, setLoadingFetch] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const items = readLocalStorageItem("cart") || [];
      setCart(items);

      try {
        const response = await authService.getProfile();
        const userShippings = response.data.user.shippings || [];
        setShippings(userShippings);
        setSelectedShipping(userShippings.find(s => s.isDefault) || userShippings[0] || null);
      } catch (error) {
        console.error("Failed to load profile", error);
        enqueueSnackbar("Failed to load shipping addresses", { variant: "error" });
      } finally {
        setLoadingFetch(false);
      }
    };

    loadData();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 0 ? 5 : 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!selectedShipping) {
      enqueueSnackbar("Please select a shipping address", { variant: "warning" });
      return;
    }

    if (!cart || cart.length === 0) {
      enqueueSnackbar("Your cart is empty!", { variant: "warning" });
      return;
    }

    const cartItems = cart.map(item => ({
      product_id: item._id,
      quantity: item.quantity,
    }));

    try {
      Swal.fire({
        title: "Placing order...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        user_id: user._id,
        shipping_id: selectedShipping._id,
        payment_method: paymentMethod,
        cart: cartItems,
      }
      console.log("Order payload:", payload);
      await orderService.createOrder(payload);

      Swal.close();
      localStorage.removeItem("cart");
      navigate("/", { state: { message: "Order placed successfully!", status: "success" } });
    } catch (error) {
      Swal.close();
      console.error("Order failed", error);
      enqueueSnackbar(error?.response?.data?.message || "Failed to place order", { variant: "error" });
    }
  };

  if (loadingFetch) return <Spinner />;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-6">

          {/* Shipping Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Select Shipping Address</h2>
            {shippings.length === 0 && (
              <p className="text-gray-500">No shipping addresses found. Add one in your profile.</p>
            )}
            <div className="space-y-3">
              {shippings.map(shipping => (
                <ShippingOption
                  key={shipping._id}
                  shipping={shipping}
                  isSelected={selectedShipping?._id === shipping._id}
                  onSelect={() => setSelectedShipping(shipping)}
                />
              ))}
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="card" disabled checked={paymentMethod === "card"} onChange={e => setPaymentMethod(e.target.value)} />
                Credit/Debit Card
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="paypal" disabled checked={paymentMethod === "paypal"} onChange={e => setPaymentMethod(e.target.value)} />
                PayPal
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={e => setPaymentMethod(e.target.value)} />
                Cash on Delivery
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-(--color-dark-green) hover:bg-green-800 text-white font-bold py-3 rounded-xl transition"
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
