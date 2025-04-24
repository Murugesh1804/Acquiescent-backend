import express from "express";
const router = express.Router();
import { sendEmail } from "../controllers/emailer.contoller.js";

router.post("/send", sendEmail);

export default router;