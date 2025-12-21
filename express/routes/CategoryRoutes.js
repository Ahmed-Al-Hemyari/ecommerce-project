import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory,
    softDelete,
    restore,
    hardDelete, 
} from "../controllers/CategoryController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js'

const categoryRoutes = express.Router();

// // Delete
// Soft Delete
categoryRoutes.patch('/delete', requireAdmin, softDelete);
// Restore
categoryRoutes.patch('/restore', requireAdmin, restore);
// Hard delete
categoryRoutes.delete('/delete', requireAdmin , hardDelete);



// Get all categories
categoryRoutes.get('/', getAllCategories);

// Get a single category by ID
categoryRoutes.get('/:id', getCategoryById);

// Create a new category
categoryRoutes.post('/', requireAdmin , createCategory);

// Update an existing category
categoryRoutes.put('/:id', requireAdmin , updateCategory);


export default categoryRoutes;