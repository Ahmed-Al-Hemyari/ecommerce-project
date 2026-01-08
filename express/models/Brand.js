import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, required: false},
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

brandSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
});

brandSchema.set("toJSON", { virtuals: true });
brandSchema.set("toObject", { virtuals: true });

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;