"use client";

import { useState, useEffect } from "react";
import {
	Settings,
	FileText,
	Check,
	X,
	TreePine,
	Leaf,
	Mountain,
	Lock,
	Unlock,
	Search,
	Clock,
	Image as ImageIcon,
	Ban,
	ArrowRight,
} from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import FloatingParticles from "@/components/FloatingParticles";
import SubmissionModal from "@/components/SubmissionModal";
import { Submission } from "@/types/submission";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
	const [submissions, setSubmissions] = useState<Submission[]>([]);
	const [submissionsOpen, setSubmissionsOpen] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedSubmission, setSelectedSubmission] =
		useState<Submission | null>(null);
	const router = useRouter();

	const pendingSubmissions = submissions.filter((s) => s.status === "pending");
	const selectedSubmissions = submissions.filter(
		(s) => s.status === "selected"
	);
	const rejectedSubmissions = submissions.filter(
		(s) => s.status === "rejected"
	);
	const rejectedFinalSubmissions = submissions.filter(
		(s) => s.status === "rejected_final"
	);

	const loadSubmissions = async () => {
		try {
			const user = JSON.parse(localStorage.getItem("user") || "{}");
			const email = user?.email;
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_URL}/submissions`,
				{
					params: { email },
				}
			);
			setSubmissions(response.data.submissions);
			console.log("Submissions loaded");
		} catch (error) {
			console.error("Error fetching submissions:", error);
			router.push("/admin/not-authorized");
		}
	};

	useEffect(() => {
		if (!localStorage.getItem("user")) {
			router.push("/admin/not-authorized");
			return;
		}
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		setSubmissionsOpen(user.formStatus === "opened");
		console.log("Loading submissions...");
		loadSubmissions();

		// Set up interval to refresh submissions every minute
		const intervalId = setInterval(() => {
			loadSubmissions();
		}, 60000 * 5); // 60000 ms = 1 minute

		// Clean up interval on component unmount
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleStatusChange = async (
		email: string,
		newStatus: "selected" | "rejected" | "rejected_final" | "pending"
	) => {
		try {
			// Update UI immediately for better UX
			setSubmissions((prev) =>
				prev.map((sub) =>
					sub.email === email ? { ...sub, status: newStatus } : sub
				)
			);

			// Send API request to update status in Firebase
			await axios.post("/api/statusChange", {
				email,
				status: newStatus,
			});

			toast.success(
				`Submission ${
					newStatus === "selected"
						? "accepted"
						: newStatus === "rejected"
						? "rejected"
						: newStatus === "rejected_final"
						? "permanently rejected"
						: "pending"
				}`
			);
		} catch (error) {
			console.error("Error updating submission status:", error);
			toast.error("Failed to update submission status");

			// Revert UI change on error
			setSubmissions((prev) =>
				prev.map((sub) =>
					sub.email === email ? { ...sub, status: "pending" } : sub
				)
			);
		}
	};

	const handleToggleSubmissions = () => {
		setSubmissionsOpen(!submissionsOpen);
		try {
			const user = JSON.parse(localStorage.getItem("user") || "{}");
			const email = user?.email;
			axios.post(`${process.env.NEXT_PUBLIC_API_URL}/toggleSubmissions`, {
				email,
				status: !submissionsOpen,
			});
			console.log("Submissions toggled");
			if (!submissionsOpen) {
				toast.success("Submissions open");
			} else {
				toast.success("Submissions closed");
			}
		} catch {
			console.error("Error toggling submissions");
			toast.error("Error toggling submissions");
		}
	};

	const handleAdvanceRound = async () => {
		try {
			// Call the API to advance to the next round
			const response = await axios.post("/api/advanceRound");

			// Reload submissions to reflect the changes
			await loadSubmissions();

			toast.success(
				`Advanced to next round! ${response.data.updatedCount} submissions updated.`
			);
		} catch (error) {
			console.error("Error advancing to next round:", error);
			toast.error("Failed to advance to next round");
		}
	};

	const filteredSubmissions = (status: string) => {
		const filtered = submissions.filter((s) => s.status === status);
		if (!searchTerm) return filtered;
		return filtered.filter(
			(s) =>
				s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				s.prompt.toLowerCase().includes(searchTerm.toLowerCase())
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const SubmissionCard = ({ submission }: { submission: Submission }) => (
		<div
			className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
			onClick={() => setSelectedSubmission(submission)}
		>
			<div className="flex items-start space-x-4">
				{submission.image_url ? (
					<Image
						src={submission.image_url}
						alt="Submission"
						width={80}
						height={80}
						className="w-20 h-20 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
						<ImageIcon className="w-8 h-8 text-green-400" />
					</div>
				)}

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-2">
						<h3 className="font-semibold text-green-800 truncate">
							{submission.name}
						</h3>
						<span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
							@{submission.username}
						</span>
					</div>

					<p className="text-gray-700 text-sm mb-3 line-clamp-3">
						{submission.prompt}
					</p>

					<div className="flex items-center justify-between">
						<div className="flex items-center text-xs text-green-600">
							<Clock className="w-3 h-3 mr-1" />
							{formatDate(submission.submitted_at)}
						</div>

						<div
							className="flex space-x-2"
							onClick={(e) => e.stopPropagation()}
						>
							{submission.status === "pending" && (
								<>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "selected")
										}
										className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Accept"
									>
										<Check className="w-4 h-4" />
									</button>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "rejected")
										}
										className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Reject"
									>
										<X className="w-4 h-4" />
									</button>
								</>
							)}
							{submission.status === "selected" && (
								<>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "pending")
										}
										className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Mark as Pending"
									>
										<Clock className="w-4 h-4" />
									</button>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "rejected")
										}
										className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Reject"
									>
										<X className="w-4 h-4" />
									</button>
								</>
							)}
							{submission.status === "rejected" && (
								<>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "pending")
										}
										className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Mark as Pending"
									>
										<Clock className="w-4 h-4" />
									</button>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "selected")
										}
										className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Accept"
									>
										<Check className="w-4 h-4" />
									</button>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "rejected_final")
										}
										className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Permanently Reject"
									>
										<Ban className="w-4 h-4" />
									</button>
								</>
							)}
							{submission.status === "rejected_final" && (
								<>
									<button
										onClick={() =>
											handleStatusChange(submission.email, "pending")
										}
										className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200 shadow-sm"
										title="Mark as Pending"
									>
										<Clock className="w-4 h-4" />
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 opacity-10">
					<TreePine className="w-24 h-24 text-green-500 animate-pulse" />
				</div>
				<div className="absolute top-20 right-20 opacity-10">
					<Mountain
						className="w-32 h-32 text-emerald-600 animate-bounce"
						style={{ animationDuration: "4s" }}
					/>
				</div>
				<div className="absolute bottom-20 left-1/4 opacity-10">
					<Leaf
						className="w-16 h-16 text-teal-500 animate-spin"
						style={{ animationDuration: "6s" }}
					/>
				</div>

				{/* Floating particles */}
				<FloatingParticles count={8} color="green" />
			</div>

			<div className="relative z-10 p-6">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
								<Settings className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
									Admin Panel
								</h1>
								<p className="text-green-700 opacity-80">
									Manage submissions and curate nature&apos;s gallery
								</p>
							</div>
						</div>

						{/* Submission Toggle and Next Round */}
						<div className="flex items-center space-x-4">
							<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-100">
								<div className="flex items-center space-x-3">
									<span className="text-green-800 font-medium">
										Submissions:
									</span>
									<button
										onClick={() => handleToggleSubmissions()}
										className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
											submissionsOpen
												? "bg-green-500 text-white shadow-lg"
												: "bg-red-500 text-white shadow-lg"
										}`}
									>
										{submissionsOpen ? (
											<Unlock className="w-4 h-4" />
										) : (
											<Lock className="w-4 h-4" />
										)}
										<span className="font-medium">
											{submissionsOpen ? "Open" : "Closed"}
										</span>
									</button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white">
												<ArrowRight className="w-4 h-4" />
												<span>Next Round</span>
											</button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Advance to Next Round?
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will move all
													selected submissions to pending and all rejected
													submissions to permanently rejected.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction onClick={handleAdvanceRound}>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
					<div
						key="total"
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-green-600 text-sm font-medium">
									Total Submissions
								</p>
								<p className="text-2xl font-bold text-green-800">
									{submissions.length}
								</p>
							</div>
							<FileText className="w-8 h-8 text-green-500" />
						</div>
					</div>

					<div
						key="rejected_final"
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-purple-600 text-sm font-medium">
									Permanently Rejected
								</p>
								<p className="text-2xl font-bold text-purple-800">
									{rejectedFinalSubmissions.length}
								</p>
							</div>
							<Ban className="w-8 h-8 text-purple-500" />
						</div>
					</div>

					<div
						key="rejected"
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-red-600 text-sm font-medium">Rejected</p>
								<p className="text-2xl font-bold text-red-800">
									{rejectedSubmissions.length}
								</p>
							</div>
							<X className="w-8 h-8 text-red-500" />
						</div>
					</div>

					<div
						key="pending"
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-amber-600 text-sm font-medium">
									Pending Review
								</p>
								<p className="text-2xl font-bold text-amber-800">
									{pendingSubmissions.length}
								</p>
							</div>
							<Clock className="w-8 h-8 text-amber-500" />
						</div>
					</div>

					<div
						key="selected"
						className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-green-600 text-sm font-medium">Selected</p>
								<p className="text-2xl font-bold text-green-800">
									{selectedSubmissions.length}
								</p>
							</div>
							<Check className="w-8 h-8 text-green-500" />
						</div>
					</div>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-100">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
							<input
								type="text"
								placeholder="Search submissions by username, name, or prompt..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:outline-none text-green-800 placeholder-green-400"
							/>
						</div>
					</div>
				</div>

				{/* Four Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Permanently Rejected Column */}
					<div className="space-y-6">
						<div className="bg-purple-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-200">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-purple-500 rounded-lg">
									<Ban className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-purple-800">
										Permanently Rejected
									</h2>
									<p className="text-purple-600 text-sm">
										{filteredSubmissions("rejected_final").length} submissions
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 max-h-[600px] overflow-y-auto">
							{filteredSubmissions("rejected_final").map((submission) => (
								<SubmissionCard
									key={submission.email}
									submission={submission}
								/>
							))}
							{filteredSubmissions("rejected_final").length === 0 && (
								<div className="text-center py-8 text-purple-400">
									<Ban className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No permanently rejected submissions</p>
								</div>
							)}
						</div>
					</div>

					{/* Rejected Column */}
					<div className="space-y-6">
						<div className="bg-red-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-red-200">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-red-500 rounded-lg">
									<X className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-red-800">Rejected</h2>
									<p className="text-red-600 text-sm">
										{filteredSubmissions("rejected").length} submissions
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 max-h-[600px] overflow-y-auto">
							{filteredSubmissions("rejected").map((submission) => (
								<SubmissionCard
									key={submission.email}
									submission={submission}
								/>
							))}
							{filteredSubmissions("rejected").length === 0 && (
								<div className="text-center py-8 text-red-400">
									<X className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No rejected submissions</p>
								</div>
							)}
						</div>
					</div>

					{/* Pending Column */}
					<div className="space-y-6">
						<div className="bg-amber-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-amber-500 rounded-lg">
									<Clock className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-amber-800">
										Pending Review
									</h2>
									<p className="text-amber-600 text-sm">
										{filteredSubmissions("pending").length} submissions
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 max-h-[600px] overflow-y-auto">
							{filteredSubmissions("pending").map((submission) => (
								<SubmissionCard
									key={submission.email}
									submission={submission}
								/>
							))}
							{filteredSubmissions("pending").length === 0 && (
								<div className="text-center py-8 text-amber-400">
									<Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No pending submissions</p>
								</div>
							)}
						</div>
					</div>

					{/* Selected Column */}
					<div className="space-y-6">
						<div className="bg-green-100/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-green-200">
							<div className="flex items-center space-x-3">
								<div className="p-2 bg-green-500 rounded-lg">
									<Check className="w-5 h-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-green-800">Selected</h2>
									<p className="text-green-600 text-sm">
										{filteredSubmissions("selected").length} submissions
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 max-h-[600px] overflow-y-auto">
							{filteredSubmissions("selected").map((submission) => (
								<SubmissionCard
									key={submission.email}
									submission={submission}
								/>
							))}
							{filteredSubmissions("selected").length === 0 && (
								<div className="text-center py-8 text-green-400">
									<Check className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No selected submissions</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Submission Modal */}
			{selectedSubmission && (
				<SubmissionModal
					submission={selectedSubmission}
					onClose={() => setSelectedSubmission(null)}
					onStatusChange={(email, status) => {
						handleStatusChange(email, status);
						setSelectedSubmission(null);
					}}
				/>
			)}

			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-25px);
					}
				}

				.line-clamp-3 {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			`}</style>
			<Toaster richColors />
		</div>
	);
}
