import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "No token provided"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if user still exists
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        if (user.deleted) {
          return res.status(401).json({ message: 'User has been deleted' });
        }
        
        req.user = user;
        
        if (req.user.role !== 'admin') {
            return res.status(403).json({message: "Unauthorized access!! Admins only."});
        }
        next();
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
}