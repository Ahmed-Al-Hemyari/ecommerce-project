import express from 'express';
import { 
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
 } from "../controllers/OrderController.js";

const orderRoutes = express.Router();

// Get all orders
orderRoutes.get('/', getAllOrders);
// Get order by ID
orderRoutes.get('/:id', getOrderById);
// Create new order
orderRoutes.post('/', createOrder);
// Update order
orderRoutes.put('/:id', updateOrder);
// Delete order
orderRoutes.delete('/:id', deleteOrder);

export default orderRoutes;