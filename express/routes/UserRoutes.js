import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
 } from "../controllers/UserController.js";
import { requireAuth } from '../middlewares/auth.js'

const userRoutes = express.Router();

// Get All Users
userRoutes.get('/', requireAuth , getAllUsers);
// Get User by ID
userRoutes.get('/:id', requireAuth , getUserById);
// Create New User
userRoutes.post('/', requireAuth , createUser);
// Update User
userRoutes.put('/:id', requireAuth , updateUser);
// Delete User
userRoutes.delete('/:id', requireAuth , deleteUser);

export default userRoutes;