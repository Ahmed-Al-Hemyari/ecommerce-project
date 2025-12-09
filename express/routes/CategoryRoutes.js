import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js'

const categoryRoutes = express.Router();

// Get all products
categoryRoutes.get('/', getAllCategories);

// Get a single product by ID
categoryRoutes.get('/:id', getCategoryById);

// Create a new product
categoryRoutes.post('/', requireAdmin , createCategory);

// Update an existing product
categoryRoutes.put('/:id', requireAdmin , updateCategory);

// Delete a product
categoryRoutes.delete('/:id', requireAdmin , deleteCategory);

export default categoryRoutes;