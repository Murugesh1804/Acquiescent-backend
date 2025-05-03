import express from "express"
const router = express.Router();
import {
  createBrochureDownload,
  getAllBrochureDownloads
} from "../controllers/brochure.controller.js";

// POST - Store a new brochure download entry
router.post('/save', createBrochureDownload);

// GET - Retrieve all entries
router.get('/fetch', getAllBrochureDownloads);

export default router;
