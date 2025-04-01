import express from "express"
import { register, login, getCurrentAdmin } from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", protect, getCurrentAdmin)

export default router
