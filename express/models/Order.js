import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    user: { type: ObjectId, ref: "User", required: true },
    orderItems: [{
        product: { type: ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shipping: {
        // fullName: { type: String, required: true},
        // email: { type: String, required: true},
        // phone: { type: String, required: true},
        address1: { type: String, required: true},
        address2: { type: String, required: false},
        city: { type: String, required: true},
        zip: { type: String, required: true},
        country: { type: String, required: true},
        paymentMethod: { type: String, required: true },
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    payed: { type: Boolean, default: false}

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;