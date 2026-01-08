import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category" },
    brand: { type: ObjectId, ref: "Brand" },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    orderItems: { type: ObjectId, ref: 'OrderItem'},
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;