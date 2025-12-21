import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct,
    addStock,
    softDelete,
    restore,
    hardDelete
} from '../controllers/ProductController.js';
import { requireAdmin } from '../middlewares/admin.js'
import { uploadProduct } from '../config/multer.js';

const productRoutes = express.Router();


// // Delte
// Soft Delete
productRoutes.patch('/delete', requireAdmin, softDelete);
// Restore
productRoutes.patch('/restore', requireAdmin, restore);
// Hard delete
productRoutes.delete('/delete', requireAdmin, hardDelete);

// Get all products
productRoutes.get('/', getAllProducts);

// Get a single product by ID
productRoutes.get('/:id', getProductById);

// Create a new product
productRoutes.post('/', requireAdmin, uploadProduct.single("file") , createProduct);

// Update an existing product
productRoutes.put('/:id', requireAdmin, uploadProduct.single("file") , updateProduct);

// Add stock to a product
productRoutes.patch('/add-stock/:id', requireAdmin , addStock);

export default productRoutes;