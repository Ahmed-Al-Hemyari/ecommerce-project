import express from 'express';
import { 
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    deleteMany
} from "../controllers/BrandController.js";
import { requireAdmin } from '../middlewares/admin.js'
import { uploadBrand } from '../config/multer.js'

const brandRoutes = express.Router();

// Delete many
brandRoutes.delete('/bulk-delete', requireAdmin, deleteMany);

// Get all products
brandRoutes.get('/', getAllBrands);

// Get a single product by ID
brandRoutes.get('/:id', getBrandById);

// Create a new product
brandRoutes.post('/', requireAdmin, uploadBrand.single("file"), createBrand);

// Update an existing product
brandRoutes.put('/:id', requireAdmin, uploadBrand.single("file"), updateBrand);

// Delete a product
brandRoutes.delete('/:id', requireAdmin , deleteBrand);

export default brandRoutes;