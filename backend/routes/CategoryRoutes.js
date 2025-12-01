import express from 'express';
import { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";

const categoryRouter = express.Router();

// Get all products
categoryRouter.get('/', getAllCategories);

// Get a single product by ID
categoryRouter.get('/:id', getCategoryById);

// Create a new product
categoryRouter.post('/', createCategory);

// Update an existing product
categoryRouter.put('/:id', updateCategory);

// Delete a product
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;