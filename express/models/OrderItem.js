import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderItemSchema = new mongoose.Schema({
    product: { type: ObjectId, ref: "Product", required: true },
    order: { type: ObjectId, ref: "Order", required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;