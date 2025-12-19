import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    deleteMany,
    updateMany,
    restoreMany,
    restoreUser,
    hardDelete,
 } from "../controllers/UserController.js";
 
import { requireAdmin } from '../middlewares/admin.js';

const userRoutes = express.Router();

// Delete many
userRoutes.patch('/bulk-delete', requireAdmin, deleteMany);
// Restore many
userRoutes.patch('/bulk-restore', requireAdmin, restoreMany);
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
// Delete User
userRoutes.patch('/:id', requireAdmin , deleteUser);
// Restore User
userRoutes.patch('/restore/:id', requireAdmin , restoreUser);

// Hard delete User
userRoutes.delete('/', requireAdmin , hardDelete);

export default userRoutes;