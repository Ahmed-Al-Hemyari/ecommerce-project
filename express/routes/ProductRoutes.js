import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    deleteMany
} from '../controllers/ProductController.js';
import { requireAdmin } from '../middlewares/admin.js'
import { uploadProduct } from '../config/multer.js';

const productRoutes = express.Router();

// Delete many
productRoutes.patch('/bulk-delete', requireAdmin, deleteMany);

// Get all products
productRoutes.get('/', getAllProducts);

// Get a single product by ID
productRoutes.get('/:id', getProductById);

// Create a new product
productRoutes.post('/', requireAdmin, uploadProduct.single("file") , createProduct);

// Update an existing product
productRoutes.put('/:id', requireAdmin, uploadProduct.single("file") , updateProduct);

// Delete a product
productRoutes.patch('/:id', requireAdmin , deleteProduct);

export default productRoutes;