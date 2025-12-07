import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";
import { requireAuth } from '../middlewares/auth.js'

const categoryRouter = express.Router();

// Get all products
categoryRouter.get('/', getAllCategories);

// Get a single product by ID
categoryRouter.get('/:id', getCategoryById);

// Create a new product
categoryRouter.post('/', requireAuth , createCategory);

// Update an existing product
categoryRouter.put('/:id', requireAuth , updateCategory);

// Delete a product
categoryRouter.delete('/:id', requireAuth , deleteCategory);

export default categoryRouter;