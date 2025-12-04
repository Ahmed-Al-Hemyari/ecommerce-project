import express from 'express';
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
 } from "../controllers/UserController.js";

const userRoutes = express.Router();

// Get All Users
userRoutes.get('/', getAllUsers);
// Get User by ID
userRoutes.get('/:id', getUserById);
// Create New User
userRoutes.post('/', createUser);
// Update User
userRoutes.put('/:id', updateUser);
// Delete User
userRoutes.delete('/:id', deleteUser);

export default userRoutes;