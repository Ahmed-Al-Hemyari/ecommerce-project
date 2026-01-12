import express from 'express';
import { requireAuth } from '../middlewares/auth.js'
import { 
    createOrderItem, 
    deleteOrderItem, 
    getOrderItemById, 
    // updateOrderItem
} from '../controllers/OrderItemController.js';

const orderItemRoutes = express.Router();

orderItemRoutes.get('/:id', requireAuth, getOrderItemById);
orderItemRoutes.post('/', requireAuth, createOrderItem);
// orderItemRoutes.put('/:id', requireAuth, updateOrderItem);
orderItemRoutes.delete('/delete', requireAuth, deleteOrderItem);

export default orderItemRoutes;