import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, courseInterests, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      courseInterests,
      role
    })

    // Generate token
    const token = generateToken(user._id)

    // Remove password from response
    user.password = undefined

    res.status(201).json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate token
    const token = generateToken(user._id)

    // Remove password from response
    user.password = undefined

    res.status(200).json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Register user interest in a course (without full registration)
export const registerInterest = async (req, res) => {
  try {
    const { name, email, phone, courseId } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })

    if (user) {
      // Add course interest if not already added
      if (!user.courseInterests.includes(courseId)) {
        user.courseInterests.push(courseId)
        await user.save()
      }
    } else {
      // Create new user with minimal info
      user = await User.create({
        name,
        email,
        phone,
        password: Math.random().toString(36).slice(-8), // Generate random password
        courseInterests: [courseId],
      })
    }

    res.status(201).json({
      success: true,
      message: "Interest registered successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
