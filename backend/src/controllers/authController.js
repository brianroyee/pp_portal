import { db } from "../config/firebase.js";

export const login = async (req, res) => {
	const { username, password } = req.body;

	try {
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
				formStatus: user.formStatus ? user.formStatus : "opened",
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Authentication failed",
			error: error.message,
		});
	}
};
