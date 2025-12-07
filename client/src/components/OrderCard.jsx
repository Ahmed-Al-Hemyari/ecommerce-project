import React from "react";
import Swal from "sweetalert2";

const OrderCard = ({ order, onCancel }) => {
  // Payment method mapping
  const paymentMethods = {
    cod: "Cash on Delivery",
    card: "Credit/Debit Card",
    paypal: "PayPal",
  };
  const payMethod = paymentMethods[order.shipping.paymentMethod] || "";

  const handleCancel = async () => {
    if (!onCancel) return;
    const result = await Swal.fire({
      title: "Sure you want to cancel order??",
      icon: 'warning',
      confirmButtonText: "Yes, cancel order",
      confirmButtonColor: "#33b17e",
      showCancelButton: true,
    })
    if (result.isConfirmed) onCancel(order._id);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Order <span className="text-blue-800 font-bold">#{order._id.slice(-6).toUpperCase()}</span>
        </span>
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Status & Payment */}
      <div className="flex flex-wrap gap-3 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "Processing"
              ? "bg-blue-100 text-blue-800"
              : order.status === "Shipped"
              ? "bg-indigo-100 text-indigo-800"
              : order.status === "Delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.payed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {payMethod} {order.payed ? "• Paid" : "• Not Paid"}
        </span>
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
          Shipping Address
        </p>
        <p className="text-gray-700 text-sm">
          {order.shipping.address1}
          {order.shipping.address2 && `, ${order.shipping.address2}`},{" "}
          {order.shipping.city}, {order.shipping.zip}, {order.shipping.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
          Items
        </p>
        <div className="max-h-40 overflow-y-auto space-y-2">
          {order.orderItems.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-gray-700 text-sm hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{item.product.title}</span>
              <span className="text-gray-500">
                {item.quantity} x ${item.price} = ${item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center font-semibold text-gray-800 text-lg mb-4 border-t border-gray-100 pt-3">
        <span>Total</span>
        <span>${order.totalAmount}</span>
      </div>

      {/* Cancel Button */}
      {(order.status === "Pending" || order.status === "Processing") && (
        <button
          onClick={handleCancel}
          className="w-full py-3 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors shadow-sm"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderCard;
