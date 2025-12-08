import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/ProductController.js';
import { requireAdmin } from '../middlewares/admin.js'

const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Get a single product by ID
productRouter.get('/:id', getProductById);

// Create a new product
productRouter.post('/', requireAdmin , createProduct);

// Update an existing product
productRouter.put('/:id', requireAdmin , updateProduct);

// Delete a product
productRouter.delete('/:id', requireAdmin , deleteProduct);

export default productRouter;