import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    category: { 
        _id: { type: ObjectId, ref: "Category" },
        name: { type: String, required: true }
    },
    brand: { 
        _id: { type: ObjectId, ref: "Brand" },
        name: { type: String, required: true }
    },
    image: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;