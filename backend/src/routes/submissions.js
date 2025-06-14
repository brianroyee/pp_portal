import express from "express";
import multer from "multer";
import {
	submitEntry,
	getSubmissions,
	changeStatus,
	advanceToNextRound
} from "../controllers/submissionController.js";

const router = express.Router();
const upload = multer();

// Routes
router.post("/submit", upload.single("image"), submitEntry);
router.get("/submissions", getSubmissions);
router.post("/statusChange", changeStatus);
router.post("/advanceRound", advanceToNextRound);

export default router;
