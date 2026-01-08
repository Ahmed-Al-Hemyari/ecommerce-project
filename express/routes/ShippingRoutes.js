import express from "express";
import { requireAdmin } from '../middlewares/admin.js'
import { requireAuth } from '../middlewares/auth.js'
import { 
    createShipping, 
    deleteShipping, 
    getShippingById, 
    getShippingsForUser,
    makeDefault, 
    updateShipping 
} from "../controllers/ShippingController.js";

const shippingRoutes = express.Router();

// Get for user
shippingRoutes.get('/user/:id', requireAuth, getShippingsForUser);
// Get By Id
shippingRoutes.get('/:id', requireAuth, getShippingById);
// Create
shippingRoutes.post('/', requireAuth, createShipping);
// Update
shippingRoutes.put('/:id', requireAuth, updateShipping);
// Make Default
shippingRoutes.patch('/:id', requireAuth, makeDefault);
// Delete
shippingRoutes.delete('/:id', requireAuth, deleteShipping);

export default shippingRoutes;