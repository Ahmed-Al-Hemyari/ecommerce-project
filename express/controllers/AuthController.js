import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// User Registration
export const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User({ name, email, phone, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// User Login
export const loginByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user._id);
        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

export const loginByPhone = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }
        const token = generateToken(user._id);
        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};