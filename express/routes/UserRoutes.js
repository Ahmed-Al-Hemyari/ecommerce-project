import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteMany,
    updateMany,
 } from "../controllers/UserController.js";
 
import { requireAdmin } from '../middlewares/admin.js';

const userRoutes = express.Router();

// Delete many
userRoutes.delete('/bulk-delete', requireAdmin, deleteMany);
// Update many
userRoutes.put('/bulk-update', requireAdmin, updateMany);


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