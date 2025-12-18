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
        if (user.deleted) {
          return res.status(401).json({ message: 'User has been deleted' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt }, token });
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
        if (user.deleted) {
          return res.status(401).json({ message: 'User has been deleted' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, createdAt: user.createdAt }, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // TRUST THE TOKEN ONLY
    const { name, email, phone } = req.body;


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id; // TRUST THE TOKEN ONLY
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong old password" });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating password",
      error: error.message
    });
  }
};
