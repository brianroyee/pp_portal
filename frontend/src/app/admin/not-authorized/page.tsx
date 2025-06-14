"use client";

import { useState, useEffect } from "react";
import {
	Shield,
	ShieldAlert,
	Lock,
	TreePine,
	Mountain,
	Leaf,
	EyeOff,
	Home,
	AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FloatingParticles from "@/components/FloatingParticles";

export default function NotAuthorizedPage() {
	const router = useRouter();
	const [animationPhase, setAnimationPhase] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationPhase((prev) => (prev + 1) % 3);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative overflow-hidden flex items-center justify-center">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 opacity-10">
					<TreePine className="w-32 h-32 text-red-400 animate-pulse" />
				</div>
				<div className="absolute top-20 right-20 opacity-10">
					<Mountain
						className="w-40 h-40 text-orange-500 animate-bounce"
						style={{ animationDuration: "4s" }}
					/>
				</div>
				<div className="absolute bottom-20 left-1/4 opacity-10">
					<Leaf
						className="w-24 h-24 text-amber-500 animate-spin"
						style={{ animationDuration: "6s" }}
					/>
				</div>
				<div className="absolute bottom-10 right-10 opacity-10">
					<Shield
						className="w-28 h-28 text-red-500 animate-pulse"
						style={{ animationDuration: "3s" }}
					/>
				</div>

				{/* Warning triangles floating */}
				{[...Array(5)].map((_, i) => (
					<div
						key={i}
						className="absolute opacity-20"
						style={{
							left: `${20 + Math.random() * 60}%`,
							top: `${20 + Math.random() * 60}%`,
							animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
							animationDelay: `${Math.random() * 2}s`,
						}}
					>
						<AlertTriangle className="w-6 h-6 text-red-400" />
					</div>
				))}

				{/* Floating particles */}
				<FloatingParticles count={12} color="red" />
			</div>

			<div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
				{/* Main Error Content */}
				<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-red-100">
					{/* Animated Shield Icon */}
					<div className="relative mb-8">
						<div className="mx-auto w-32 h-32 relative">
							<div
								className={`absolute inset-0 bg-gradient-to-r from-red-400 to-orange-500 rounded-full transition-all duration-1000 ${
									animationPhase === 0
										? "scale-100 opacity-100"
										: animationPhase === 1
										? "scale-110 opacity-80"
										: "scale-95 opacity-90"
								}`}
							>
								<div className="flex items-center justify-center w-full h-full">
									{animationPhase === 0 ? (
										<ShieldAlert className="w-16 h-16 text-white" />
									) : animationPhase === 1 ? (
										<Lock className="w-16 h-16 text-white" />
									) : (
										<EyeOff className="w-16 h-16 text-white" />
									)}
								</div>
							</div>

							{/* Ripple effect */}
							<div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-30"></div>
							<div className="absolute inset-0 rounded-full border-2 border-orange-400 animate-pulse opacity-50"></div>
						</div>
					</div>

					{/* Error Message */}
					<div className="space-y-6">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
							Access Forbidden
						</h1>

						<div className="space-y-3">
							<p className="text-xl text-red-800 font-semibold">
								🌲 This sacred grove is protected 🌲
							</p>
							<p className="text-red-700 leading-relaxed">
								You don&apos;t have permission to enter this area of Prompted
								Pastures&apos; Admin Panel. Only authorized forest guardians can
								access these ancient secrets.
							</p>
						</div>

						{/* Warning Box */}
						<div className="bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 p-6 rounded-2xl text-left">
							<div className="flex items-start space-x-3">
								<AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
								<div>
									<h3 className="font-semibold text-red-800 mb-2">
										Security Notice
									</h3>
									<p className="text-red-700 text-sm leading-relaxed">
										Unauthorized access attempts are logged and monitored. If
										you believe you should have access to this area, please
										contact your administrator.
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
							<button
								onClick={handleGoHome}
								className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
							>
								<Home className="w-5 h-5 mr-2" />
								Return to Forest Home
							</button>
						</div>
					</div>

					{/* Decorative Elements */}
					<div className="mt-8 pt-8 border-t border-red-200">
						<div className="flex items-center justify-center space-x-4 text-red-400">
							<TreePine className="w-6 h-6" />
							<span className="text-sm font-medium">
								Protected by Nature&apos;s Guardian
							</span>
							<Leaf className="w-6 h-6" />
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-8 text-center">
					<p className="text-red-600 text-sm opacity-80">
						Error Code: 403 | Access Denied to Sacred Administrative Grounds
					</p>
				</div>
			</div>

			{/* Floating Nature Elements */}
			<div className="absolute bottom-10 left-10 opacity-30">
				<div className="flex space-x-2">
					<div className="w-4 h-4 bg-red-300 rounded-full animate-bounce"></div>
					<div
						className="w-4 h-4 bg-orange-300 rounded-full animate-bounce"
						style={{ animationDelay: "0.1s" }}
					></div>
					<div
						className="w-4 h-4 bg-amber-300 rounded-full animate-bounce"
						style={{ animationDelay: "0.2s" }}
					></div>
				</div>
			</div>

			<div className="absolute top-10 right-10 opacity-30">
				<div className="flex space-x-2">
					<div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
					<div
						className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"
						style={{ animationDelay: "0.5s" }}
					></div>
					<div
						className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"
						style={{ animationDelay: "1s" }}
					></div>
				</div>
			</div>

			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px) rotate(0deg);
					}
					50% {
						transform: translateY(-20px) rotate(5deg);
					}
				}
			`}</style>
		</div>
	);
}