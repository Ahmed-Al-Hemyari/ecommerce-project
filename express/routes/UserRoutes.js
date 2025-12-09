import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
 } from "../controllers/UserController.js";
import { requireAuth } from '../middlewares/auth.js'
import { requireAdmin } from '../middlewares/admin.js';

const userRoutes = express.Router();

// Get All Users
userRoutes.get('/', requireAdmin , getAllUsers);
// Get User by ID
userRoutes.get('/:id', requireAdmin , getUserById);
// Create New User
userRoutes.post('/', requireAdmin , createUser);
// Update User
userRoutes.put('/:id', requireAdmin , updateUser);
// Delete User
userRoutes.delete('/:id', requireAdmin , deleteUser);

export default userRoutes;