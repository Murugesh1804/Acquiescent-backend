import express from "express";
import { createEnrollment, getEnrollments } from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/", createEnrollment);
router.get("/", getEnrollments);

export default router;
