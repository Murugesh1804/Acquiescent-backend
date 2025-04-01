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
router.post("/create", createBlog)
router.put("/update/:id", updateBlog)
router.post("/delete/:id", deleteBlog)

export default router

