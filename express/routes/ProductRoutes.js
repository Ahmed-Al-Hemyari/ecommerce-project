import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/ProductController.js';

const productRouter = express.Router();

// Get all products
productRouter.get('/', getAllProducts);

// Get a single product by ID
productRouter.get('/:id', getProductById);

// Create a new product
productRouter.post('/', createProduct);

// Update an existing product
productRouter.put('/:id', updateProduct);

// Delete a product
productRouter.delete('/:id', deleteProduct);

export default productRouter;