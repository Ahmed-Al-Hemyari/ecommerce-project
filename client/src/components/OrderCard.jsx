import React from "react";

const OrderCard = ({ order, onCancel }) => {
  // Payment method mapping
  const paymentMethods = {
    cod: "Cash on Delivery",
    card: "Credit/Debit Card",
    paypal: "PayPal",
  };

  const payMethod = paymentMethods[order.shipping.paymentMethod] || "";

  // Handle cancel click
  const handleCancel = () => {
    if (onCancel) onCancel(order._id);
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6">

      {/* Header: Order ID & Date */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Order #{order._id.slice(-6)}</span>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Status & Payment */}
      <div className="flex flex-wrap gap-4 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
            order.status === "Processing" ? "bg-blue-100 text-blue-800" :
            order.status === "Shipped" ? "bg-indigo-100 text-indigo-800" :
            order.status === "Delivered" ? "bg-green-100 text-green-800" :
            "bg-red-100 text-red-800"
          }`}
        >
          {order.status}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.payed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {payMethod} {order.payed ? "• Paid" : "• Not Paid"}
        </span>
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
        <p className="text-gray-700">
          {order.shipping.address1}
          {order.shipping.address2 && `, ${order.shipping.address2}`}, {order.shipping.city}, {order.shipping.zip}, {order.shipping.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Items</p>
        <div className="space-y-1">
          {order.orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-gray-700 text-sm">
              <span>{item.product.title} x {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-gray-800 text-lg mb-4">
        <span>Total</span>
        <span>${order.totalAmount}</span>
      </div>

      {/* Cancel Button */}
      {(order.status === "Pending" || order.status === "Processing") && (
        <button
          onClick={handleCancel}
          className="w-full py-2 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderCard;
