import { Inter, Lusitana, Poppins, Urbanist } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });

export const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const urbanist = Urbanist({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const lusitana = Lusitana({
	weight: ["400", "700"],
	subsets: ["latin"],
});
