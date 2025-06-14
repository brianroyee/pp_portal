import { db } from "../config/firebase.js";

// Helper function to sanitize email for Firebase keys
const sanitizeEmailKey = (email) => {
	return email.replace(/[@.]/g, "_");
};

export const toggleSubmissions = async (req, res) => {
	const { email, status } = req.body;

	try {
		// Verify admin status
		const emailKey = sanitizeEmailKey(email);
		const adminSnapshot = await db.ref(`otps/${emailKey}`).once("value");
		const adminData = adminSnapshot.val();

		if (!adminData || adminData.role !== "admin") {
			return res
				.status(403)
				.json({ success: false, message: "Not Authorized" });
		}

		// Get all entries
		const snapshot = await db.ref("otps").once("value");
		const data = snapshot.val();

		if (!data) {
			return res
				.status(404)
				.json({ success: false, message: "No entries found" });
		}

		// Prepare updates
		const formStatus = status ? "opened" : "closed";
		const updates = {};

		for (const key in data) {
			if (data[key]) {
				updates[`otps/${key}/formStatus`] = formStatus;
			}
		}

		// Update all entries
		await db.ref().update(updates);

		res.status(200).json({
			success: true,
			message: `Submissions ${formStatus}`,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to toggle submissions",
			error: error.message,
		});
	}
};
