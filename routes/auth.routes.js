import express from "express"
import { register, login, getCurrentUser, registerInterest } from "../controllers/auth.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)
router.post("/register-interest", registerInterest)

// Protected routes
router.get("/me", protect, getCurrentUser)

export default router
