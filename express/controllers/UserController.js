import User from "../models/User.js";
import Order from '../models/Order.js'

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { search, role, deleted } = req.query;
        const query = {};

        if (search) {
            const orQuery = [
                { name: { $regex: search, $options: "i" } },
                { eamil: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ];

            query.$or = orQuery;
        }

        if (role) query.role = role;
        if (deleted !== undefined) {
            query.deleted = deleted; // use the boolean directly
        } else {
            query.deleted = { $ne: true }; // include all where deleted is not true
        }

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 50;
        const skip = (page - 1) * limit;
    
        const totalItems = await User.countDocuments(query);

        const users = await User.find(query).select('-password')
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            users: users, 
            currentPage: page,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
}; 

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Create new user
export const createUser = async (req, res) => {
    try {
        const newUser = {};
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.phone = req.body.phone;
        newUser.password = req.body.email; // Default password is email
        newUser.role = "user";

        const existingUser = await User.find({ email: newUser.email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        const user = new User(newUser);
        await user.save();
        res.status(201).json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user", error });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, role },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { deleted: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

// Restore user
export const restoreUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { deleted: false });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User restored successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error restoring user", error });
    }
};

// Delete many
export const deleteMany = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No user IDs provided" });
    }

    const usersResult = await User.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true, } },
    );

    res.status(200).json({
      message: "Users and deleted successfully",
    //   deletedUsers: usersResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting users",
      error: error.message,
    });
    console.log(error);
  }
};

// Restore many
export const restoreMany = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No user IDs provided" });
    }

    const usersResult = await User.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: false } },
    );

    res.status(200).json({
      message: "Users and restored successfully",
    //   deletedUsers: usersResult.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring users",
      error: error.message,
    });
    console.log(error);
  }
};

// Update many
export const updateMany = async (req, res) => {
    try {
        const { ids, updates } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No user IDs provided" });
        }

        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ message: "No update data provided" });
        }

        const result = await User.updateMany(
            { _id: { $in: ids }},
            { $set: updates }
        );

        res.status(200).json({
            message: "Users updated successfully",
            // matched: result.matchedCount,
            // modified: result.modifiedCount,
        });
        
    } catch (error) {
        res.status(500).json({message: error.message });
    }
}