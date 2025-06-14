import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

function sanitizeEmailKey(email) {
	return email.replace(/[@.]/g, "_");
}

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	// Query only for the specific user by username
	const snapshot = await db
		.ref("otps")
		.orderByChild("username")
		.equalTo(username)
		.once("value");
	const userData = snapshot.val();

	if (!userData) {
		return res
			.status(404)
			.json({ success: false, message: "Username not found" });
	}

	// Get the first (and should be only) user with this username
	const userId = Object.keys(userData)[0];
	const user = userData[userId];

	if (user.otp !== password) {
		return res
			.status(401)
			.json({ success: false, message: "Incorrect password" });
	}

	res.status(200).json({
		success: true,
		message: "Login successful",
		user: {
			username,
			email: user.email,
			name: user.name,
			role: user.role ? user.role : "user",
		},
	});
});

// router.post("/toggleSubmissions", async (req, res) => {
// 	const { email, status } = req.body;
// 	const emailKey = sanitizeEmailKey(email);
// 	const adminSnapshot = await db.ref(`otps/${emailKey}`).once("value");
// 	const adminData = adminSnapshot.val();
// 	console.log("adminData", adminData);

// 	if (!adminData || adminData.role !== "admin") {
// 		return res.status(403).json({ success: false, message: "Not Authorized" });
// 	}

// 	const snapshot = await db.ref("otps").once("value");
// 	const data = snapshot.val();

// 	if (!data) {
// 		console.warn("No submissions found.");
// 		return;
// 	}

// 	let formStatus = "";

// 	if (status) {
// 		console.log("Opening all submissions.");
// 		formStatus = "opened";
// 	} else {
// 		console.log("Closing all submissions.");
// 		formStatus = "closed";
// 	}

// 	const updates = {};
// 	for (const emailKey in data) {
// 		if (data[emailKey]) {
// 			updates[`otps/${emailKey}/formStatus`] = formStatus;
// 		}
// 	}

// 	await db.ref().update(updates);
// 	console.log("All formStatus fields updated.");

// 	res.status(200).json({ success: true, message: `Submission ${formStatus}` });
// });

export default router;
