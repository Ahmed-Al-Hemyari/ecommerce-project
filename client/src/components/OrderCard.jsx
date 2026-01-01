import React from "react";
import Swal from "sweetalert2";

const OrderCard = ({ order, onCancel }) => {
  // Payment method mapping
  const paymentMethods = {
    cod: "Cash on Delivery",
    card: "Credit/Debit Card",
    paypal: "PayPal",
  };
  const payMethod = paymentMethods[order.paymentMethod] || "";

  const handleCancel = async () => {
    if (!onCancel) return;

    // Ask for confirmation
    const result = await Swal.fire({
      title: "Sure you want to cancel this order?",
      icon: "warning",
      confirmButtonText: "Yes, cancel order",
      confirmButtonColor: "#33b17e",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    // Show loading modal
    Swal.fire({
      title: "Cancelling...",
      text: "Please wait while the order is being cancelled.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await onCancel(order._id); // call the cancel function

      Swal.fire({
        title: "Cancelled!",
        text: "The order has been successfully cancelled.",
        icon: "success",
        confirmButtonColor: "#33b17e",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Failed to cancel the order.",
        icon: "error",
        confirmButtonColor: "#d50101",
      });
    }
  };


  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Order <span className="text-blue-800 font-bold">#{order.orderId || order._id}</span>
        </span>
        <span className="text-sm text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Status & Payment */}
      <div className="flex flex-wrap gap-3 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "processing"
              ? "bg-blue-100 text-blue-800"
              : order.status === "shipped"
              ? "bg-indigo-100 text-indigo-800"
              : order.status === "delivered"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {payMethod} {order.paid ? "• Paid" : "• Not Paid"}
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
              <span className="font-medium">{item.product.name}</span>
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
        <span>${order.total}</span>
      </div>

      {/* Cancel Button */}
      {(order.status === "pending" || order.status === "processing") && (
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
