import Category from '../models/Category.js';
import Product from '../models/Product.js'

// Get all products
export const getAllCategories = async (req, res) => {
  try {
    const { search, deleted } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { slug: { $regex: search, $options: "i" } }
        ];
    }

    if (deleted !== undefined) {
      query.deleted = deleted; // use the boolean directly
    } else {
      query.deleted = { $ne: true }; // include all where deleted is not true
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : null;
    const skip = (page - 1) * limit;

    const totalItems = await Category.countDocuments(query);

    let categoryQuery = Category.find(query);
    if (limit) {
      categoryQuery = categoryQuery.skip(skip).limit(limit);
    }

    const categories = await categoryQuery;

    res.status(200).json({
      categories: categories, 
      currentPage: page,
      totalItems: totalItems,
      totalPages: limit ? Math.ceil(totalItems / limit) : 1,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
export const createCategory = async (req, res) => {
  try {
      if (!req.body.name || !req.body.slug ) {   
          return res.status(400).json({ message: 'Name and slug are required' });
      }
      const newCategory = Category({
          name: req.body.name,
          slug: req.body.slug,
      });
      const category = await Category.create(newCategory);
      res.status(201).json(category);
  } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing product
export const updateCategory = async (req, res) => {
  try {
    const newData = {};
    if (req.body.name) newData.name = req.body.name;
    if (req.body.slug) newData.slug = req.body.slug;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: newData },
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Soft Delete
export const softDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const categoryResult = await Category.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      message: "Categories deleted successfully",
      // deletedCategories: categoryResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting categories",
      error: error.message,
    });
    console.log(error);
  }
};

// Restore
export const restore = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const categoryResult = await Category.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: false } }
    );

    res.status(200).json({
      message: "Categories restored successfully",
      // deletedCategories: categoryResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring categories",
      error: error.message,
    });
    console.log(error);
  }
};

// Hard delete
export const hardDelete = async (req, res) => {
  try {
    const { ids } = req.body;
  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }
    
    const products = await Product.find({ "category._id": { $in: ids } });

    if (products.length > 0) {
      return res.status(400).json({ message: "Can't delete category with products" });
    }
  
    await Category.deleteMany(
      { _id: { $in: ids } },
    );
  
    res.status(200).json({
      message: "Categories deleted permenantly successfully"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error deleting categories",
      error: error.message,
    });
  }
}