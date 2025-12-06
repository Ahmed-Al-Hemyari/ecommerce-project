import express from 'express';
import { register, loginByEmail, loginByPhone } from "../controllers/AuthController.js";
import { requireAuth } from '../middlewares/auth.js';

const authRoutes = express.Router();

// User Registration Route
authRoutes.post('/register', register);
// User Login Route
authRoutes.post('/login-email', loginByEmail);
authRoutes.post('/login-phone', loginByPhone);
// Check Auth
authRoutes.get('/check-auth', requireAuth, (req, res) => {
    res.json({authenticated: true});
});
// Get Profile
authRoutes.get('/profile', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

export default authRoutes;