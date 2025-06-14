import express from "express";
import multer from "multer";
import { submitEntry, getSubmissions } from "../controllers/submissionController.js";

const router = express.Router();
const upload = multer();

// Routes
router.post("/submit", upload.single("image"), submitEntry);
router.get("/submissions", getSubmissions);

export default router;