"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { inter, poppins, urbanist } from "@/ui/fonts";

interface Alert {
	id: number;
	message: string;
	type: "success" | "danger";
}

interface User {
	username: string;
	password: string;
	email: string;
	name: string;
}

const LoginPage = () => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [alerts, setAlerts] = useState<Alert[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Mock user data for demonstration
	const mockUsers: User[] = [
		{
			username: "john_doe",
			password: "nature123",
			email: "john@example.com",
			name: "John Doe",
		},
		{
			username: "jane_smith",
			password: "green456",
			email: "jane@example.com",
			name: "Jane Smith",
		},
		{
			username: "demo",
			password: "demo",
			email: "demo@techiepedia.com",
			name: "Demo User",
		},
	];

	const showAlert = (
		message: string,
		type: "success" | "danger" = "success"
	) => {
		const newAlert: Alert = { id: Date.now(), message, type };
		setAlerts((prev) => [...prev, newAlert]);
		setTimeout(() => {
			setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id));
		}, 4000);
	};

	const handleLogin = async () => {
		if (!formData.username || !formData.password) {
			showAlert("Please fill in all fields.", "danger");
			return;
		}

		setIsLoading(true);

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		try {
			const response = await axios.post(
				"http://127.0.0.1:5000/api/login",
				formData
			);
			if (response) {
				// Store user data in localStorage or context
				localStorage.setItem("user", JSON.stringify(response));
				showAlert("Login successful! Redirecting...", "success");

				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			} else {
				const userExists = mockUsers.find(
					(user) => user.username === formData.username
				);
				if (userExists) {
					showAlert("Incorrect password. Please try again.", "danger");
				} else {
					showAlert(
						"Username not found. Please check your credentials.",
						"danger"
					);
				}
			}
			setIsLoading(false);
		} catch {
			showAlert("Login failed. Please try again.", "danger");
			setIsLoading(false);
			return;
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleLogin();
		}
	};

	// Floating decorations component
	const FloatingDecorations = () => (
		<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
			{["🍃", "🌿", "🍀"].map((emoji, index) => (
				<div
					key={`emoji-${index}`}
					className="absolute opacity-30 text-2xl animate-float"
					style={{
						left: `${10 + index * 30}%`,
						animationDelay: `${index * 5}s`,
						animationDuration: "20s",
					}}
				>
					{emoji}
				</div>
			))}
		</div>
	);

	// Alert component
	const AlertComponent = ({ alert }: { alert: Alert }) => (
		<div
			className={`p-3 rounded-lg mb-2 font-medium animate-slide-down ${
				alert.type === "success"
					? "bg-green-100 text-green-800 border border-green-200"
					: "bg-red-100 text-red-800 border border-red-200"
			}`}
		>
			{alert.message}
		</div>
	);

	return (
		<div
			className={`min-h-screen ${poppins.className} flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 font-serif px-5`}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-green-200/30 via-blue-200/30 to-yellow-200/20 animate-gradient"></div>
			<FloatingDecorations />

			<div className="bg-white/95 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md relative z-10 animate-slide-up">
				<div className="text-center mb-8">
					<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
						<span className="text-xl">🌿</span>
					</div>
					<p className="text-green-600 ">Techiepedia</p>
					<h1
						className={`text-3xl ${urbanist.className} font-bold text-green-800 mb-2`}
					>
						Prompted Pastures
					</h1>
				</div>

				{alerts.length > 0 && (
					<div className="mb-6">
						{alerts.map((alert: Alert) => (
							<AlertComponent key={`alert-${alert.id}`} alert={alert} />
						))}
					</div>
				)}

				<div className="space-y-6">
					<div className="space-y-2">
						<div className="block text-green-800 font-bold text-sm">
							Username
						</div>
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							className="w-full p-4 border-2 border-gray-200 rounded-xl h-15 text-black transition-all duration-300 bg-white/80 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white hover:border-green-300"
							placeholder="Enter your username"
						/>
					</div>

					<div className="space-y-2">
						<div className="block text-green-800 font-bold text-sm">
							Password
						</div>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							className="w-full p-4 border-2 border-gray-200 rounded-xl text-base text-black transition-all duration-300 bg-white/80 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-100 focus:bg-white hover:border-green-300"
							placeholder="Enter your password"
						/>
					</div>

					<button
						onClick={handleLogin}
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white p-4 rounded-xl text-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden cursor-pointer"
					>
						{isLoading ? (
							<span className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
								Signing In...
							</span>
						) : (
							"🌱 Sign In"
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
