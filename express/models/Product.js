import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category" },
    category: { type: ObjectId, ref: "Brand" },
    images: { type: [String], default: [] },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;