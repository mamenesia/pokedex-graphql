"use client";

import { MoreHorizontal } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
	<nav
		aria-label="pagination"
		className={cn("mx-auto flex w-full justify-center", className)}
		data-slot="pagination"
		role="navigation"
		{...props}
	/>
);

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			className={cn("flex flex-row items-center gap-1", className)}
			data-slot="pagination-content"
			{...props}
		/>
	);
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li className={cn("", className)} data-slot="pagination-item" {...props} />
	);
}

const PaginationEllipsis = ({
	className,
	...props
}: React.ComponentProps<"span">) => (
	<span
		aria-hidden
		className={cn("flex h-9 w-9 items-center justify-center", className)}
		data-slot="pagination-ellipsis"
		{...props}
	>
		<MoreHorizontal className="h-4 w-4" />
		<span className="sr-only">More pages</span>
	</span>
);

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem };
