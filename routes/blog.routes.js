import express from "express"
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogCategoriesAndTags,
} from "../controllers/blog.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public/Optional Auth routes
router.get("/all", getAllBlogs)
router.get("/slug/:slug", getBlogBySlug)
router.get("/categories-tags", getBlogCategoriesAndTags)

// Protected routes
router.post("/create", protect, createBlog)
router.put("/update/:id",protect, updateBlog)
router.post("/delete/:id",protect, deleteBlog)

export default router

