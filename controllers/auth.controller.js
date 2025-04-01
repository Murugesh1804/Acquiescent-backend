import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Admin credentials from environment variables
const JWT_SECRET = "1234567890";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Admin login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in the database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
      message: "Login successful. Store this token in local storage on the client side."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new admin user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user with admin role
    const user = await User.create({
      name,
      email,
      password,
      role: "admin"
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current admin details
export const getCurrentAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user || user.role !== "admin") {
      console.log("Access denied");
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      admin: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};