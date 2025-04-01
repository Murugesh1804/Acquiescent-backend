import express from "express"
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  enrollUserInCourse,
  getUserStats,
} from "../controllers/user.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Admin only routes
router.get("/", protect, getAllUsers)
router.get("/stats", protect, getUserStats)
router.delete("/:id", protect, deleteUser)

// Protected routes
router.get("/:id", protect, getUserById)
router.put("/:id", protect, updateUser)
router.post("/enroll", protect, enrollUserInCourse)

export default router

