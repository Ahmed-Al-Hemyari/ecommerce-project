import Category from '../models/Category.js';
import Brand from '../models/Brand.js'
import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice } = req.query;
    const query = {};

    if (search) {
      const orFilters = [
          { name: { $regex: search, $options: "i" } },
          { 'category.name': { $regex: search, $options: "i" } },
          { 'brand.name': { $regex: search, $options: "i" } },
      ];

      if (!isNaN(search)) {
          orFilters.push({ price: Number(search) });
      }

      query.$or = orFilters;
    }

    if (category) query['category._id'] = category;
    if (brand) query['brand._id'] = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const totalItems = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      products: products, 
      currentPage: page,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / limit)
    });
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
    if (!req.body.name || !req.body.price || !req.body.category || !req.body.brand) {   
        return res.status(400).json({ message: 'Name, brand, category, and price are required' });
    }

    // Check Category
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Check Brand
    const brand = await Brand.findById(req.body.brand);
    if (!category) {
      return res.status(400).json({ message: 'Brand not found' });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;

    // Create Product
    const newProduct = Product({
      name: req.body.name,
      price: req.body.price,
      brand: {
        _id: brand._id,
        name: brand.name,
      },
      category: {
        _id: category._id,
        name: category.name,
      },
      description: req.body.description || '',
      image: imageUrl,
    });
    const product = await Product.create(newProduct);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// // Update an existing product
// export const updateProduct = async (req, res) => {
//   try {
//     const newData = {};
//     if (req.body.name) newData.name = req.body.name;
//     if (req.body.brand) newData.brand = req.body.brand;
//     if (req.body.category) newData.category = req.body.category;
//     if (req.body.description) newData.description = req.body.description;
//     if (req.body.price) newData.price = req.body.price;
//     if (req.body.image) newData.image = req.body.image;

//     // Check Category
//     if (req.body.category) 
//     {
//       const category = await Category.findById(req.body.category);
//       if (!category) {
//         return res.status(400).json({ message: 'Category not found' });
//       }
//       newData.category = {
//         _id: category._id,
//         name: category.name,
//       };
//     }

//     // Check Brand
//     if (req.body.brand) 
//     {
//       const brand = await Brand.findById(req.body.brand);
//       if (!brand) {
//         return res.status(400).json({ message: 'Brand not found' });
//       }
//       newData.brand = {
//         _id: brand._id,
//         name: brand.name
//       };
//     }
    
//     // Update Product
//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       newData,
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json({ message: 'Product updated successfully' });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Update an existing brand
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const newData = {};

    if (req.body.name) newData.name = req.body.name;
    if (req.body.brand) newData.brand = req.body.brand;
    if (req.body.category) newData.category = req.body.category;
    if (req.body.description) newData.description = req.body.description;
    if (req.body.price) newData.price = req.body.price;

    // Check Category
    if (req.body.category) 
    {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
      newData.category = {
        _id: category._id,
        name: category.name,
      };
    }

    // Check Brand
    if (req.body.brand) 
    {
      const brand = await Brand.findById(req.body.brand);
      if (!brand) {
        return res.status(400).json({ message: 'Brand not found' });
      }
      newData.brand = {
        _id: brand._id,
        name: brand.name
      };
    }

    // Update logo if a file was uploaded
    if (req.file) {
      const imageUrl = `/uploads/products/${req.file.filename}`;
      newData.image = imageUrl;

      // Delete old image safely
      if (product.image) {
        const imagePath = path.join(process.cwd(), product.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.warn('Old logo not found or already deleted:', err.message);
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: newData },
      { new: true }
    );

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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