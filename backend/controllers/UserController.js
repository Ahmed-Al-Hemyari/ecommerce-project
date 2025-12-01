import User from "../models/User";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
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
        newUser.password = req.body.phone; // Default password is phone number
        newUser.role = "user";

        const existingUser = await User.find({ email: newUser.email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }
        const user = new User(newUser);
        await user.save();
        res.status(201).json({ message: "User created successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address },
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
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};