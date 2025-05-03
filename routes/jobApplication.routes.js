import express from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { protect } from "../middleware/auth.middleware.js"
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} from "../controllers/jobApplication.controller.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "resume-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".doc", ".docx"]
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"))
    }
  },
})

const router = express.Router()

// Public routes
router.post("/submit", upload.single("resume"), submitApplication)

// Protected routes (admin only)
router.get("/", protect, getApplications)
router.patch("/:id/status", protect, updateApplicationStatus)

export default router