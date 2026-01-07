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
  shipping: { 
    _id: { type: ObjectId, ref: "Shipping", required: true },
    address1: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'draft',
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled'
    ],
    default: "pending",
  },
  paid: { type: Boolean, default: false },
  paidAt: { type: Date, required: false, default: null}
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;