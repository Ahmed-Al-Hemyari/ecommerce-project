import Brand from '../models/Brand.js'
import Product from '../models/Product.js';
import fs from "fs";
import path from "path";

// Get all products
export const getAllBrands = async (req, res) => {
  try {
    const { search, deleted } = req.query;
    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } }
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

    const totalItems = await Brand.countDocuments(query);

    let brandsQuery = Brand.find(query);
    if (limit) {
      brandsQuery = brandsQuery.skip(skip).limit(limit);
    }

    const brands = await brandsQuery;

    res.status(200).json({
      brands: brands, 
      currentPage: page,
      totalItems: totalItems,
      totalPages: limit ? Math.ceil(totalItems / limit) : 1,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
export const createBrand = async (req, res) => {
  try {
    if (!req.body.name || !req.file) {   
        return res.status(400).json({ message: 'Name, and logo are required' });
    }

    const logoUrl = `/uploads/brands/${req.file.filename}`;

    const newBrand = Brand({
        name: req.body.name,
        logo: logoUrl,
    });
    
    const brand = await Brand.create(newBrand);
    res.status(201).json(brand);
  } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing brand
export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Check required fields (optional: only name required)
    if (!req.body.name && !req.file) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const newData = {};

    // Update name
    if (req.body.name) newData.name = req.body.name;

    // Update logo if a file was uploaded
    if (req.file) {
      const logoUrl = `/uploads/brands/${req.file.filename}`;
      newData.logo = logoUrl;

      // Delete old logo safely
      if (brand.logo) {
        const imagePath = path.join(process.cwd(), brand.logo);
        fs.unlink(imagePath, (err) => {
          if (err) console.warn('Old logo not found or already deleted:', err.message);
        });
      }
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { $set: newData },
      { new: true }
    );

    res.status(200).json({ message: 'Brand updated successfully', brand: updatedBrand });

  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// // Delete
// Soft Delete
export const softDelete = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    const brandResult = await Brand.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true }},
    );

    res.status(200).json({
      message: "Brands deleted successfully",
      // deletedBrands: brandResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting brands",
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

    const brandResult = await Brand.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: false }},
    );

    res.status(200).json({
      message: "Brands restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restored brands",
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
    
    const products = await Product.find({ "brand._id": { $in: ids } });

    if (products.length > 0) {
      return res.status(400).json({ message: "Can't delete brand with products" });
    }
  
    await Brand.deleteMany(
      { _id: { $in: ids } },
    );
  
    res.status(200).json({
      message: "Brands deleted permenantly successfully"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error deleting brands",
      error: error.message,
    });
  }
}