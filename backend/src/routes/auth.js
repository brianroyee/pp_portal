import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

const loadUsers = async () => {
	const snapshot = await db.ref("otps").once("value");
	const users = snapshot.val();
	return users ? Object.values(users) : [];
};

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const users = await loadUsers();

	const user = users.find((u) => u.username === username);
	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "Username not found" });
	}

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
		},
	});
});

export default router;
