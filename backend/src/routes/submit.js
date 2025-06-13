import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";
import { db } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const upload = multer();

router.post("/submit", upload.single("image"), async (req, res) => {
	const { text } = req.body;
	const image = req.file;
	let imageUrl = null;

	if (image) {
		const fileName = `${uuidv4()}.${image.originalname.split(".").pop()}`;
		const { error } = await supabase.storage
			.from("submissions")
			.upload(fileName, image.buffer);
		if (error) {
			return res
				.status(500)
				.json({ success: false, message: "Failed to upload image", error });
		}
		const { data } = supabase.storage
			.from("submissions")
			.getPublicUrl(fileName);
		imageUrl = data.publicUrl;
	}

	const emailKey = req.session.emailKey;
	const submissionData = {
		prompt: text,
		image_url: imageUrl,
		submitted_at: new Date().toISOString(),
	};

	await db.ref(`otps/${emailKey}`).update(submissionData);

	res.status(200).json({
		success: true,
		message: "Submission successful",
		data: submissionData,
	});
});

router.get("/submissions", async (req, res) => {
	if (!req.session.username) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const emailKey = req.session.emailKey;
	const snapshot = await db.ref(`otps/${emailKey}`).once("value");
	const data = snapshot.val();

	if (!data) {
		return res
			.status(404)
			.json({ success: false, message: "No submission found" });
	}

	res.status(200).json({
		success: true,
		user: {
			username: req.session.username,
			email: req.session.email,
			name: req.session.name,
		},
		submission: {
			prompt: data.prompt,
			image_url: data.image_url,
		},
	});
});

export default router;
