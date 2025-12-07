import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/ProductController.js';
import { requireAuth } from '../middlewares/auth.js'

const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Get a single product by ID
productRouter.get('/:id', getProductById);

// Create a new product
productRouter.post('/', requireAuth , createProduct);

// Update an existing product
productRouter.put('/:id', requireAuth , updateProduct);

// Delete a product
productRouter.delete('/:id', requireAuth , deleteProduct);

export default productRouter;