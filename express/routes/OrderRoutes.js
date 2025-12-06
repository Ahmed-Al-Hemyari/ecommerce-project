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

const orderRoutes = express.Router();

// Get all orders
orderRoutes.get('/', getAllOrders);
// Get all orders
orderRoutes.get('/user/:id', getOrdersForUser);
// Get order by ID
orderRoutes.get('/:id', getOrderById);
// Create new order
orderRoutes.post('/', createOrder);
// Update order
orderRoutes.put('/:id', updateOrder);
// Cancel order
orderRoutes.put('/:id/cancel', cancelOrder);
// Delete order
orderRoutes.delete('/:id', deleteOrder);

export default orderRoutes;