import express from 'express';
import { 
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersForUser,
    cancelOrder
 } from "../controllers/OrderController.js";
import { requireAuth } from '../middlewares/auth.js'

const orderRoutes = express.Router();

// Get all orders
orderRoutes.get('/', requireAuth , getAllOrders);
// Get all orders
orderRoutes.get('/user/:id', requireAuth , getOrdersForUser);
// Get order by ID
orderRoutes.get('/:id', requireAuth , getOrderById);
// Create new order
orderRoutes.post('/', requireAuth , createOrder);
// Update order
orderRoutes.put('/:id', requireAuth , updateOrder);
// Cancel order
orderRoutes.put('/:id/cancel', requireAuth , cancelOrder);
// Delete order
orderRoutes.delete('/:id', requireAuth , deleteOrder);

export default orderRoutes;