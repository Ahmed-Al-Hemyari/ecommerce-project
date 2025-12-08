import express from 'express';
import { register, loginByEmail, loginByPhone, updateProfile, changePassword } from "../controllers/AuthController.js";
import { requireAuth } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/admin.js';

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
// Check Auth and Admin
authRoutes.get('/check-admin', requireAdmin, (req, res) => {
    res.json({authenticated: true, isAdmin: true});
});
// Get Profile
authRoutes.get('/profile', requireAuth, (req, res) => {
    res.json({ user: req.user });
});
// Update Profile
authRoutes.put('/profile/update', requireAuth, updateProfile);
// Change Password
authRoutes.put('/profile/change-password', requireAuth, changePassword);

export default authRoutes;