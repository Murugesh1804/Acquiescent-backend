import express from "express"
import {
  getAllCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
} from "../controllers/course.controller.js"
import { protect, adminOnly, optionalAuth } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public/Optional Auth routes
router.get("/", optionalAuth, getAllCourses)
router.get("/slug/:slug", optionalAuth, getCourseBySlug)

// Admin only routes
router.post("/", protect, adminOnly, createCourse)
router.put("/:id", protect, adminOnly, updateCourse)
router.delete("/:id", protect, adminOnly, deleteCourse)
router.get("/stats", protect, adminOnly, getCourseStats)

export default router

