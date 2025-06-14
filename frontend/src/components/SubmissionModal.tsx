"use client";

import { X, Check } from "lucide-react";
import Image from "next/image";
import { Submission } from "@/types/submission";
import { useEffect } from "react";

interface SubmissionModalProps {
	submission: Submission;
	onClose: () => void;
	onStatusChange: (id: string, status: "selected" | "rejected") => void;
}

export default function SubmissionModal({
	submission,
	onClose,
	onStatusChange,
}: SubmissionModalProps) {
	// Disable body scrolling when modal is open
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 bg-white/80 p-2 rounded-full z-10 hover:bg-white transition-colors cursor-pointer"
				>
					<X className="w-6 h-6 text-gray-700" />
				</button>

				<div className="flex flex-col md:flex-row h-full">
					{submission.image_url ? (
						<div className="md:w-1/2 relative h-[300px] md:h-auto">
							<Image
								src={submission.image_url}
								alt="Submission"
								fill
								className="object-cover"
							/>
						</div>
					) : (
						<div className="md:w-1/2 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
							<span className="text-green-600 text-lg">No image submitted</span>
						</div>
					)}

					<div className="p-6 md:w-1/2 overflow-y-auto max-h-[500px]">
						<div className="mb-4">
							<h2 className="text-2xl font-bold text-green-800">
								{submission.name}
							</h2>
							<p className="text-sm text-green-600">@{submission.username}</p>
						</div>

						<div className="mb-6">
							<h3 className="text-lg font-semibold text-green-700 mb-2">
								Prompt
							</h3>
							<p className="text-gray-700">{submission.prompt}</p>
						</div>

						<div className="mb-6">
							<p className="text-sm text-gray-500">
								Submitted on {formatDate(submission.submitted_at)}
							</p>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={() => onStatusChange(submission.id, "selected")}
								className="flex-1 py-3 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
							>
								<Check className="w-5 h-5" />
								<span>Accept</span>
							</button>
							<button
								onClick={() => onStatusChange(submission.id, "rejected")}
								className="flex-1 py-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center space-x-2"
							>
								<X className="w-5 h-5" />
								<span>Reject</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
