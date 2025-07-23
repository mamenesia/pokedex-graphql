"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
	const router = useRouter();

	return (
		<button
			className="mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-800"
			onClick={() => router.back()}
		>
			<ArrowLeft className="h-4 w-4" />
			<span className="font-medium">Back</span>
		</button>
	);
}
