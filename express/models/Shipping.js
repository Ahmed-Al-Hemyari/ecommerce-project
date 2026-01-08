import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const shippingSchema = new mongoose.Schema({
    
    user: { type: ObjectId, ref: "User", required: true },
    address1: { type: String, required: true },
    address2: { type: String, required: false },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }

}, { timestamps: true });

const Shipping = mongoose.model("Shipping", shippingSchema);
export default Shipping;