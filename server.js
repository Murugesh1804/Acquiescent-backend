import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.routes.js"
import courseRoutes from "./routes/course.routes.js"
import blogRoutes from "./routes/blog.routes.js"
import userRoutes from "./routes/user.routes.js"
import enrollmentRoutes from "./routes/enrollRoutes.js"
import queryRoutes from "./routes/queryRoutes.js"
import brochure from "./routes/brochure.routes.js"
import emailer from "./routes/emailer.router.js"

// Configuration
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept PDFs and images
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF and image files are allowed!"), false)
    }
  },
})

// Make uploads directory accessible
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/blogs", blogRoutes)
app.use("/api/users", userRoutes)
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/brochure", brochure);
app.use("/api/email", emailer);

// Global file upload middleware
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" })
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  res.status(200).json({
    message: "File uploaded successfully",
    fileUrl: fileUrl,
    fileName: req.file.originalname,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })

