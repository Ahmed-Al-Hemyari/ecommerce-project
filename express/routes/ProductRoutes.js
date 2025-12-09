import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/ProductController.js';
import { requireAdmin } from '../middlewares/admin.js'

const productRoutes = express.Router();

// Get all products
productRoutes.get('/', getAllProducts);

// Get a single product by ID
productRoutes.get('/:id', getProductById);

// Create a new product
productRoutes.post('/', requireAdmin , createProduct);

// Update an existing product
productRoutes.put('/:id', requireAdmin , updateProduct);

// Delete a product
productRoutes.delete('/:id', requireAdmin , deleteProduct);

export default productRoutes;