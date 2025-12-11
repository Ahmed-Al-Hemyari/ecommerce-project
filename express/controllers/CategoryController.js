import Category from '../models/Category.js';

// Get all products
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
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
          // icon: req.body.icon
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
    // if (req.body.icon) newData.icon = req.body.icon;
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

// Delete a product
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};