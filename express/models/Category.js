import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true},
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

categorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
});

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;