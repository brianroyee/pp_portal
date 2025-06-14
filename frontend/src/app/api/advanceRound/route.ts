import { NextResponse } from "next/server";
import axios from "axios";

export async function POST() {
	try {
		// Forward the request to your backend
		const backendUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
		const response = await axios.post(`${backendUrl}/advanceRound`);

		return NextResponse.json(
			{
				success: true,
				message: "Advanced to next round successfully",
				updatedCount: response.data.updatedCount,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error advancing to next round:", error);
		return NextResponse.json(
			{ error: "Failed to advance to next round" },
			{ status: 500 }
		);
	}
}
