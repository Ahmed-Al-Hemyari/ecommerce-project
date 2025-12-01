import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Check fields
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.category) {   
        return res.status(400).json({ message: 'Title, description, price, and category are required' });
    }
    // Check Category
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }
    // Create Product
    const newProduct = Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      images: req.body.images || [req.body.image || ''],
    });
    const product = await Product.create(newProduct);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing product
export const updateProduct = async (req, res) => {
  try {
    const newData = {};
    if (req.body.title) newData.title = req.body.title;
    if (req.body.description) newData.description = req.body.description;
    if (req.body.price) newData.price = req.body.price;
    if (req.body.images) newData.images = req.body.images;

    // Check Category
    if (req.body.category) 
    {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
      newData.category = req.body.category;
    }
    
    // Update Product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      newData,
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};