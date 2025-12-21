import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    softDelete,
    restore,
    hardDelete,
    updateMany,
 } from "../controllers/UserController.js";
 
import { requireAdmin } from '../middlewares/admin.js';

const userRoutes = express.Router();

// // Delete
// Soft Delete
userRoutes.patch('/delete', requireAdmin, softDelete);
// Restore
userRoutes.patch('/restore', requireAdmin, restore);
// Hard delete
userRoutes.delete('/delete', requireAdmin , hardDelete);


// Update many
userRoutes.patch('/bulk-update', requireAdmin, updateMany);


// Get All Users
userRoutes.get('/', requireAdmin , getAllUsers);
// Get User by ID
userRoutes.get('/:id', requireAdmin , getUserById);
// Create New User
userRoutes.post('/', requireAdmin , createUser);
// Update User
userRoutes.put('/:id', requireAdmin , updateUser);


export default userRoutes;