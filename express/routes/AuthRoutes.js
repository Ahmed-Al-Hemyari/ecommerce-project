import express from 'express';
import { register, login } from "../controllers/AuthController.js";

const authRoutes = express.Router();

// User Registration Route
authRoutes.post('/register', register);
// User Login Route
authRoutes.post('/login', login);

export default authRoutes;