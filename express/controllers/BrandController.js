import Brand from '../models/Brand.js'

// Get all products
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
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
      if (!req.body.name) {   
          return res.status(400).json({ message: 'Name is required' });
      }
      // if (!req.body.name || !req.body.logo) {   
      //     return res.status(400).json({ message: 'Name, and logo are required' });
      // }
      const newBrand = Brand({
          name: req.body.name,
          logo: req.body.logo,
      });
      const brand = await Brand.create(newBrand);
      res.status(201).json(brand);
  } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing product
export const updateBrand = async (req, res) => {
  try {
    const newData = {};
    if (req.body.name) newData.name = req.body.name;
    if (req.body.logo) newData.name = req.body.logo;
    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      { $set: newData },
    );
    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
export const deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ message: 'Server error' });
  }
};