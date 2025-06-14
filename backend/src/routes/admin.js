import express from "express";
import { toggleSubmissions } from "../controllers/adminController.js";

const router = express.Router();

router.post("/toggleSubmissions", toggleSubmissions);

export default router;