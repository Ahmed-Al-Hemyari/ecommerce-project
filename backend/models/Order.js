import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: "User", required: true },
    orderItems: [{
        product: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, required: true },

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;