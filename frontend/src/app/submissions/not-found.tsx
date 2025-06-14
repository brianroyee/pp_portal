"use client";

import { useState, useEffect } from "react";
import {
	TreePine,
	Mountain,
	Sunset,
	Moon,
	CloudSnow,
	Clock,
	Bell,
	Heart,
	Home,
	Leaf,
	Wind,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StarryBackground from "@/components/StarryBackground";
import TimeDisplay from "@/components/TimeDisplay";

export default function FormClosedPage() {
	const router = useRouter();
	const [animationPhase, setAnimationPhase] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setAnimationPhase((prev) => (prev + 1) % 4);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 relative overflow-hidden flex items-center justify-center">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 opacity-15">
					<TreePine className="w-32 h-32 text-indigo-400 animate-pulse" />
				</div>
				<div className="absolute top-20 right-20 opacity-15">
					<Mountain
						className="w-40 h-40 text-purple-500 animate-bounce"
						style={{ animationDuration: "5s" }}
					/>
				</div>
				<div className="absolute bottom-20 left-1/4 opacity-15">
					<Sunset
						className="w-28 h-28 text-orange-400 animate-spin"
						style={{ animationDuration: "8s" }}
					/>
				</div>
				<div className="absolute top-1/3 right-1/4 opacity-10">
					<Moon
						className="w-20 h-20 text-indigo-300 animate-pulse"
						style={{ animationDuration: "4s" }}
					/>
				</div>

				{/* Client-side rendered stars and particles */}
				<StarryBackground />

				{/* Gentle wind effect */}
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
					<Wind className="w-96 h-96 text-blue-300 animate-pulse" />
				</div>
			</div>

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
				{/* Main Content */}
				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-purple-100">
					{/* Animated Clock/Moon Icon */}
					<div className="relative mb-8">
						<div className="mx-auto w-32 h-32 relative">
							<div
								className={`absolute inset-0 bg-gradient-to-r transition-all duration-1000 rounded-full ${
									animationPhase === 0
										? "from-orange-400 to-red-500 scale-100"
										: animationPhase === 1
										? "from-purple-400 to-indigo-500 scale-110"
										: animationPhase === 2
										? "from-indigo-500 to-blue-600 scale-105"
										: "from-blue-600 to-purple-600 scale-95"
								}`}
							>
								<div className="flex items-center justify-center w-full h-full">
									{animationPhase === 0 ? (
										<Sunset className="w-16 h-16 text-white" />
									) : animationPhase === 1 ? (
										<Moon className="w-16 h-16 text-white" />
									) : animationPhase === 2 ? (
										<CloudSnow className="w-16 h-16 text-white" />
									) : (
										<Clock className="w-16 h-16 text-white" />
									)}
								</div>
							</div>

							{/* Gentle glow effect */}
							<div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-pulse opacity-50"></div>
							<div className="absolute -inset-2 rounded-full border-2 border-indigo-300 animate-ping opacity-20"></div>
						</div>
					</div>

					{/* Main Message */}
					<div className="space-y-6">
						<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
							Nature&apos;s Rest Period
						</h1>

						<div className="space-y-4">
							<p className="text-2xl text-purple-800 font-semibold">
								🌙 The submission window has gently closed 🌙
							</p>
							<p className="text-purple-700 leading-relaxed text-lg">
								Like the forest that sleeps under starlight, our submission
								portal is now resting. The creative energies of all contributors
								are being carefully nurtured and reviewed.
							</p>
						</div>

						{/* Client-side rendered time display */}
						<TimeDisplay />

						{/* Status Information */}
						<div className="bg-gradient-to-r from-indigo-100 to-blue-100 border-l-4 border-indigo-500 p-6 rounded-2xl text-left">
							<div className="flex items-start space-x-3">
								<Bell className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
								<div>
									<h3 className="font-semibold text-indigo-800 mb-2">
										What happens next?
									</h3>
									<ul className="text-indigo-700 text-sm leading-relaxed space-y-1">
										<li>
											• All submissions are being carefully reviewed by our
											curators
										</li>
										<li>• Selected works will be featured on our website</li>
										<li>
											• Participants will be notified of their submission status
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Inspirational Quote */}
						<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
							<div className="flex items-center justify-center mb-3">
								<Heart className="w-6 h-6 text-green-600 mr-2" />
								<span className="text-green-800 font-medium">
									Thank you for your creativity
								</span>
								<Heart className="w-6 h-6 text-green-600 ml-2" />
							</div>
							<p className="text-green-700 italic text-center">
								&quot;In every walk with nature, one receives far more than they
								seek. Your creative spirit has added beauty to our digital
								forest.&quot;
							</p>
						</div>

						{/* Action Button */}
						<div className="pt-6">
							<button
								onClick={handleGoHome}
								className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
							>
								<Home className="w-6 h-6 mr-3" />
								Return to Nature&apos;s Home
							</button>
						</div>
					</div>

					{/* Decorative Footer */}
					<div className="mt-8 pt-8 border-t border-purple-200">
						<div className="flex items-center justify-center space-x-4 text-purple-400">
							<TreePine className="w-5 h-5" />
							<span className="text-sm font-medium">
								Submissions will reopen like spring flowers
							</span>
							<Leaf className="w-5 h-5" />
						</div>
					</div>
				</div>

				{/* Status Indicator */}
				<div className="mt-8 text-center">
					<div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200">
						<div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
						<span className="text-purple-700 text-sm font-medium">
							Submission Portal: Closed
						</span>
					</div>
				</div>
			</div>

			{/* Floating Nature Elements */}
			<div className="absolute bottom-10 left-10 opacity-40">
				<div className="flex space-x-2">
					<div className="w-4 h-4 bg-purple-300 rounded-full animate-bounce"></div>
					<div
						className="w-4 h-4 bg-indigo-300 rounded-full animate-bounce"
						style={{ animationDelay: "0.2s" }}
					></div>
					<div
						className="w-4 h-4 bg-blue-300 rounded-full animate-bounce"
						style={{ animationDelay: "0.4s" }}
					></div>
				</div>
			</div>

			<div className="absolute top-10 right-10 opacity-40">
				<div className="flex space-x-2">
					<div className="w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
					<div
						className="w-3 h-3 bg-orange-300 rounded-full animate-pulse"
						style={{ animationDelay: "0.5s" }}
					></div>
					<div
						className="w-3 h-3 bg-pink-300 rounded-full animate-pulse"
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
						transform: translateY(-15px) rotate(2deg);
					}
				}

				@keyframes twinkle {
					0%,
					100% {
						opacity: 0.3;
						transform: scale(1);
					}
					50% {
						opacity: 1;
						transform: scale(1.2);
					}
				}
			`}</style>
		</div>
	);
}
