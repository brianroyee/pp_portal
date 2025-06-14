import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase.js";
import { db } from "../config/firebase.js";

// Helper function to sanitize email for Firebase keys
export const sanitizeEmailKey = (email) => {
	return email.replace(/[@.]/g, "_");
};

export const submitEntry = async (req, res) => {
	const { text } = req.body;
	const image = req.file;
	let imageUrl = null;

	try {
		// Handle image upload if present
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

		// Prepare submission data
		const emailKey = sanitizeEmailKey(req.body.email);
		const submissionData = {
			prompt: text,
			image_url: imageUrl,
			status: "pending",
			submitted_at: new Date().toISOString(),
		};

		// Update Firebase database
		await db.ref(`otps/${emailKey}`).update(submissionData);

		res.status(200).json({
			success: true,
			message: "Submission successful",
			data: submissionData,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Submission failed",
			error: error.message,
		});
	}
};

export const getSubmissions = async (req, res) => {
	const { email } = req.query;

	if (!email) {
		return res.status(404).json({ success: false, message: "Email not found" });
	}

	try {
		const emailKey = sanitizeEmailKey(email);
		const snapshot = await db.ref(`otps/${emailKey}`).once("value");
		const data = snapshot.val();

		if (!data || data.role !== "admin") {
			return res
				.status(403)
				.json({ success: false, message: "Not Authorized" });
		}

		const submissionSnapshot = await db.ref("otps").once("value");
		const submissionData = submissionSnapshot.val();

		// Get only values that have prompt, image_url, and status
		const filteredSubmissions = Object.values(submissionData || {}).filter(
			(entry) => entry?.prompt?.trim() && entry?.image_url?.trim()
		);

		res.status(200).json({ success: true, submissions: filteredSubmissions });
	} catch (error) {
		res.status(400).json({
			success: false,
			message: "Bad Request",
			error: error.message,
		});
	}
};
