import { Toaster } from "@/components/ui/sonner";
import DashboardClient from "@/app/submissions/client";

export default function DashboardPage() {
	return (
		<>
			<DashboardClient />
			<Toaster richColors />
		</>
	);
}
