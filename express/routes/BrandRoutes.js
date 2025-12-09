import express from 'express';
import { 
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand
} from "../controllers/BrandController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js'

const brandRoutes = express.Router();

// Get all products
brandRoutes.get('/', getAllBrands);

// Get a single product by ID
brandRoutes.get('/:id', getBrandById);

// Create a new product
brandRoutes.post('/', requireAdmin , createBrand);

// Update an existing product
brandRoutes.put('/:id', requireAdmin , updateBrand);

// Delete a product
brandRoutes.delete('/:id', requireAdmin , deleteBrand);

export default brandRoutes;