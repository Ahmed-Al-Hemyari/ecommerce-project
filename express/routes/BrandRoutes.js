import express from 'express';
import { 
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    deleteMany,
    restoreMany,
    restoreBrand,
    hardDelete
} from "../controllers/BrandController.js";
import { requireAdmin } from '../middlewares/admin.js'
import { uploadBrand } from '../config/multer.js'

const brandRoutes = express.Router();

// Delete many
brandRoutes.patch('/bulk-delete', requireAdmin, deleteMany);
// Restore many
brandRoutes.patch('/bulk-restore', requireAdmin, restoreMany);

// Get all brands
brandRoutes.get('/', getAllBrands);

// Get a single brand by ID
brandRoutes.get('/:id', getBrandById);

// Create a new brand
brandRoutes.post('/', requireAdmin, uploadBrand.single("file"), createBrand);

// Update an existing brand
brandRoutes.put('/:id', requireAdmin, uploadBrand.single("file"), updateBrand);

// Delete a brand
brandRoutes.patch('/:id', requireAdmin , deleteBrand);

// Restore a brand
brandRoutes.patch('/restore/:id', requireAdmin , restoreBrand);

// Hard delete
brandRoutes.delete('/', requireAdmin , hardDelete);

export default brandRoutes;