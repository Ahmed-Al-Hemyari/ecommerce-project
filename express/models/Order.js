import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const { ObjectId } = mongoose.Schema.Types;

// Create a nanoid generator: 6 chars, alphanumeric uppercase
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
      const randomPart = nanoid(); // 6-char random
      return `${datePart}-${randomPart}`; // e.g., 20251215-4F7A2B
    },
  },
  user: { 
    _id: { type: ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  orderItems: [{
    product: {
      _id: { type: ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  shipping: {
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  payed: { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;