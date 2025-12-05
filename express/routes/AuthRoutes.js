import express from 'express';
import { register, loginByEmail, loginByPhone } from "../controllers/AuthController.js";

const authRoutes = express.Router();

// User Registration Route
authRoutes.post('/register', register);
// User Login Route
authRoutes.post('/login-email', loginByEmail);
authRoutes.post('/login-phone', loginByPhone);

export default authRoutes;