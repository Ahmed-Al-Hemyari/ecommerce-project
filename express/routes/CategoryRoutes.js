import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    deleteMany,
    restoreMany,
    restoreCategory,
    hardDelete
} from "../controllers/CategoryController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js'

const categoryRoutes = express.Router();

// Delete many
categoryRoutes.patch('/bulk-delete', requireAdmin, deleteMany);
// Restore many
categoryRoutes.patch('/bulk-restore', requireAdmin, restoreMany);

// Get all categories
categoryRoutes.get('/', getAllCategories);

// Get a single category by ID
categoryRoutes.get('/:id', getCategoryById);

// Create a new category
categoryRoutes.post('/', requireAdmin , createCategory);

// Update an existing category
categoryRoutes.put('/:id', requireAdmin , updateCategory);

// Delete a category
categoryRoutes.patch('/:id', requireAdmin , deleteCategory);

// Restore a category
categoryRoutes.patch('/restore/:id', requireAdmin , restoreCategory);

// Hard delete a category
categoryRoutes.delete('/', requireAdmin , hardDelete);

export default categoryRoutes;