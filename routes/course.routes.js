import express from "express"
import {
  getAllCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
} from "../controllers/course.controller.js"
import { protect} from "../middleware/auth.middleware.js"

const router = express.Router()

// Public/Optional Auth routes
router.get("/", getAllCourses)
router.get("/slug/:slug", getCourseBySlug)

// Admin only routes
router.post("/", protect, createCourse)
router.put("/:id", protect, updateCourse)
router.delete("/:id", protect, deleteCourse)
router.get("/stats", protect, getCourseStats)

export default router

