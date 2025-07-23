"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	size?: "small" | "medium" | "large";
	className?: string;
}

export function LoadingSpinner({
	size = "medium",
	className = "",
}: LoadingSpinnerProps) {
	const sizeClasses = {
		small: "w-4 h-4",
		medium: "w-6 h-6",
		large: "w-8 h-8",
	};

	return (
		<div className={`flex items-center justify-center ${className}`}>
			<Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />
		</div>
	);
}
