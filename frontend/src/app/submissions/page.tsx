"use client";

import { useState, useRef, useEffect } from "react";
import {
	Upload,
	Send,
	Image as ImageIcon,
	Leaf,
	Mountain,
	Sparkles,
} from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import { redirect } from "next/navigation";

interface User {
	username: string;
	email: string;
	name: string;
	formStatus: string;
}

export default function SubmissionPage() {
	const [prompt, setPrompt] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const flaskUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		if (!storedUser) {
			redirect("/login");
		}
	}, []);

	useEffect(() => {
		if (user && user.formStatus === "closed") {
			redirect("/submissions/closed");
		}
	}, [user]);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleDragOver = (event: React.DragEvent) => {
		event.preventDefault();
	};

	const removeImage = () => {
		setSelectedFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		// Here you would integrate with your Flask backend
		const formData = new FormData();
		formData.append("email", user?.email || "");
		formData.append("text", prompt);
		if (selectedFile) {
			formData.append("image", selectedFile);
		}

		if (!prompt && !selectedFile) {
			toast.error("Please enter a prompt or upload an image.");
			setIsSubmitting(false);
			return;
		}

		if (getWordCount(prompt) > 200) {
			toast.error("Prompt must be less than 200 words.");
			setIsSubmitting(false);
			return;
		}

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		try {
			const response = await axios.post(`${flaskUrl}/submit`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (response.status !== 200) {
				throw new Error("Submission failed");
			}
		} catch (error) {
			console.error("Submission failed:", error);
			toast.error("Submission failed. Please try again.");
			setIsSubmitting(false);
			return;
		}

		// Reset form after successful submission
		setPrompt("");
		removeImage();
		setIsSubmitting(false);
		toast.success("Submission successful!");
	};

	const getWordCount = (text: string) => {
		return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
	};

	return (
		<>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-10 left-10 opacity-20">
						<Leaf className="w-16 h-16 text-green-400 animate-pulse" />
					</div>
					<div className="absolute top-20 right-20 opacity-15">
						<Mountain
							className="w-20 h-20 text-emerald-500 animate-bounce"
							style={{ animationDuration: "3s" }}
						/>
					</div>
					<div className="absolute bottom-20 left-20 opacity-10">
						<Sparkles
							className="w-12 h-12 text-teal-400 animate-spin"
							style={{ animationDuration: "4s" }}
						/>
					</div>

					{/* Floating particles */}
					<FloatingParticles />
				</div>

				<div className="relative z-10 container mx-auto px-4 py-8">
					{/* Header */}
					<div className="text-center mb-12">
						<div className="flex items-center justify-center mb-4">
							<div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg">
								<Leaf className="w-8 h-8 text-white" />
							</div>
						</div>
						<h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
							Prompted Pastures
						</h1>
						<p className="text-green-700 text-lg opacity-80">
							Share your creative prompts and images with the natural world
						</p>
					</div>

					{/* Main Form */}
					<div className="max-w-4xl mx-auto">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Prompt Section */}
							<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
								<div className="flex items-center mb-6">
									<div className="p-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg mr-3">
										<Send className="w-5 h-5 text-white" />
									</div>
									<h2 className="text-2xl font-semibold text-green-800">
										Your Creative Prompt
									</h2>
								</div>

								<div className="relative">
									<textarea
										value={prompt}
										onChange={(e) => setPrompt(e.target.value)}
										placeholder="Describe your vision... Let nature inspire your words..."
										rows={8}
										className="w-full p-6 border-2 border-green-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-gradient-to-br from-white to-green-50/30 text-green-900 placeholder-green-400 resize-none text-lg"
										required
									/>
									<div
										className={`absolute bottom-4 right-4 text-sm font-medium ${
											getWordCount(prompt) > 200
												? "text-red-600"
												: "text-green-600"
										}`}
									>
										{getWordCount(prompt)} words
									</div>
								</div>
							</div>

							{/* Image Upload Section */}
							<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
								<div className="flex items-center mb-6">
									<div className="p-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-lg mr-3">
										<ImageIcon className="w-5 h-5 text-white" />
									</div>
									<h2 className="text-2xl font-semibold text-green-800">
										Visual Inspiration
									</h2>
								</div>

								{!previewUrl ? (
									<div
										onClick={() => fileInputRef.current?.click()}
										onDrop={handleDrop}
										onDragOver={handleDragOver}
										className="border-3 border-dashed border-green-300 rounded-2xl p-12 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 cursor-pointer group"
									>
										<div className="flex flex-col items-center space-y-4">
											<div className="p-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:scale-110 transition-transform duration-300">
												<Upload className="w-8 h-8 text-white" />
											</div>
											<div>
												<p className="text-xl font-semibold text-green-700 mb-2">
													Drop your image here or click to browse
												</p>
												<p className="text-green-600">
													Support for JPG, PNG, GIF up to 10MB
												</p>
											</div>
										</div>
									</div>
								) : (
									<div className="space-y-4">
										<div className="relative group">
											<Image
												src={previewUrl}
												alt="Preview"
												width={720}
												height={405}
												className="w-full max-h-96 object-fill rounded-2xl shadow-lg"
											/>
											<button
												type="button"
												onClick={removeImage}
												className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-all duration-200"
											>
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
										<p className="text-green-600 text-center font-medium">
											{selectedFile?.name} (
											{(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
										</p>
									</div>
								)}

								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileSelect}
									accept="image/*"
									className="hidden"
								/>
							</div>

							{/* Submit Button */}
							<div className="text-center">
								<button
									type="submit"
									disabled={isSubmitting || !prompt.trim()}
									className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:hover:scale-100 transition-all duration-300 disabled:cursor-not-allowed"
								>
									{isSubmitting ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Planting Your Ideas...
										</>
									) : (
										<>
											<Send className="mr-3 h-6 w-6" />
											Submit
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<Toaster richColors />
		</>
	);
}
