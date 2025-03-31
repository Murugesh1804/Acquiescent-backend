import express from "express";
import { createEnrollment, getEnrollments , submitRemark} from "../controllers/enrollmentController.js";

const router = express.Router();

router.post("/", createEnrollment);
router.get("/", getEnrollments);
router.post("/remark", submitRemark);

export default router;
