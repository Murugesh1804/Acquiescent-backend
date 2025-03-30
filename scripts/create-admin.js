import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
const envPath = path.resolve(__dirname, "../.env")
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config()
}

// Admin user details - you can change these
const adminDetails = {
  name: "Admin User",
  email: "admin@acquiescent.in",
  password: "Admin@123", // You should change this to a secure password
  role: "admin",
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB")

    // Define User schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    })

    // Create User model
    const User = mongoose.model("User", userSchema)

    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminDetails.email })

      if (existingAdmin) {
        console.log("Admin user already exists")
      } else {
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(adminDetails.password, salt)

        // Create admin user
        const admin = new User({
          name: adminDetails.name,
          email: adminDetails.email,
          password: hashedPassword,
          role: adminDetails.role,
        })

        await admin.save()
        console.log("Admin user created successfully")
      }
    } catch (error) {
      console.error("Error creating admin user:", error)
    } finally {
      // Disconnect from MongoDB
      await mongoose.disconnect()
      console.log("Disconnected from MongoDB")
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

