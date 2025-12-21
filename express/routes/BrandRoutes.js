import express from 'express';
import { 
    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    softDelete,
    restore,
    hardDelete,
} from "../controllers/BrandController.js";
import { requireAdmin } from '../middlewares/admin.js'
import { uploadBrand } from '../config/multer.js'

const brandRoutes = express.Router();

// // Delete
// Delete many
brandRoutes.patch('/delete', requireAdmin, softDelete);
// Restore many
brandRoutes.patch('/restore', requireAdmin, restore);
// Hard delete
brandRoutes.delete('/delete', requireAdmin , hardDelete);



// Get all brands
brandRoutes.get('/', getAllBrands);

// Get a single brand by ID
brandRoutes.get('/:id', getBrandById);

// Create a new brand
brandRoutes.post('/', requireAdmin, uploadBrand.single("file"), createBrand);

// Update an existing brand
brandRoutes.put('/:id', requireAdmin, uploadBrand.single("file"), updateBrand);

export default brandRoutes;