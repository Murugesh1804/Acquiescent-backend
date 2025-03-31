import express from "express";
const router = express.Router();
import { storeQuery, getQueries } from "../controllers/queryController.js";

router.post("/submit", storeQuery);
router.get("/", getQueries);

export default router;