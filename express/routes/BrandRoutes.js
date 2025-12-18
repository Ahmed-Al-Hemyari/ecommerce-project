import express from 'express';
import { 
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    deleteMany,
    restoreMany,
    restoreBrand
} from "../controllers/BrandController.js";
import { requireAdmin } from '../middlewares/admin.js'
import { uploadBrand } from '../config/multer.js'

const brandRoutes = express.Router();

// Delete many
brandRoutes.patch('/bulk-delete', requireAdmin, deleteMany);
// Restore many
brandRoutes.patch('/bulk-restore', requireAdmin, restoreMany);

// Get all products
brandRoutes.get('/', getAllBrands);

// Get a single product by ID
brandRoutes.get('/:id', getBrandById);

// Create a new product
brandRoutes.post('/', requireAdmin, uploadBrand.single("file"), createBrand);

// Update an existing product
brandRoutes.put('/:id', requireAdmin, uploadBrand.single("file"), updateBrand);

// Delete a product
brandRoutes.patch('/:id', requireAdmin , deleteBrand);

// Restore a product
brandRoutes.patch('/restore/:id', requireAdmin , restoreBrand);

export default brandRoutes;