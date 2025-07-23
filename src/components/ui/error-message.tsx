"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
	title?: string;
	message: string;
}

export function ErrorMessage({ title = "Error", message }: ErrorMessageProps) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center text-center">
			<div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8">
				<AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
				<h2 className="mb-2 font-bold text-red-800 text-xl">{title}</h2>
				<p className="text-red-600">{message}</p>
			</div>
		</div>
	);
}
