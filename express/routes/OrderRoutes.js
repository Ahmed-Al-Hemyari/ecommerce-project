import express from 'express';
import { 
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    getOrdersForUser,
    updateMany,
    deleteOrders,
 } from "../controllers/OrderController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js'

const orderRoutes = express.Router();

// Update many
orderRoutes.patch('/bulk-update', requireAdmin, updateMany);

// Get all orders
orderRoutes.get('/', requireAdmin , getAllOrders);
// Get all orders
orderRoutes.get('/user', requireAuth , getOrdersForUser);
// Get order by ID
orderRoutes.get('/:id', requireAdmin , getOrderById);
// Create new order
orderRoutes.post('/', requireAuth , createOrder);
// Update order
orderRoutes.put('/:id', requireAdmin , updateOrder);
// // Cancel order
// orderRoutes.put('/:id/cancel', requireAuth , cancelOrder);
// Delete orders
orderRoutes.delete('/', requireAdmin , deleteOrders);

export default orderRoutes;