import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    deleteMany,
    restoreMany,
    restoreProduct,
    hardDelete,
    addStock
} from '../controllers/ProductController.js';
import { requireAdmin } from '../middlewares/admin.js'
import { uploadProduct } from '../config/multer.js';

const productRoutes = express.Router();

// Delete many
productRoutes.patch('/bulk-delete', requireAdmin, deleteMany);
// Hard delete many
productRoutes.delete('/hard-delete', requireAdmin, hardDelete);
// Restore many
productRoutes.patch('/bulk-restore', requireAdmin, restoreMany);

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

// Delete a product
productRoutes.patch('/:id', requireAdmin , deleteProduct);

// Restore a product
productRoutes.patch('/restore/:id', requireAdmin , restoreProduct);

export default productRoutes;