import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";

interface PokemonPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	loading?: boolean;
	searchQuery?: string;
}

export function PokemonPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	loading = false,
	searchQuery = "",
}: PokemonPaginationProps) {
	// Don't show pagination if there's only one page or no items
	if (totalPages <= 1 || totalItems === 0) {
		return null;
	}

	// Calculate visible page numbers
	const getVisiblePages = (): (number | string)[] => {
		const delta = 2; // Number of pages to show on each side of current page
		const range: number[] = [];
		const rangeWithDots: (number | string)[] = [];

		// Always include first page
		range.push(1);

		// Add pages around current page
		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		// Always include last page if there's more than one page
		if (totalPages > 1) {
			range.push(totalPages);
		}

		// Add ellipsis where needed
		let prev = 0;
		for (const page of range) {
			if (page - prev === 2) {
				rangeWithDots.push(prev + 1);
			} else if (page - prev !== 1) {
				rangeWithDots.push("ellipsis");
			}
			rangeWithDots.push(page);
			prev = page;
		}

		return rangeWithDots;
	};

	const visiblePages = getVisiblePages();
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	return (
		<div className="flex flex-col items-center space-y-4 pt-6">
			{/* Results summary */}
			<div className="text-center text-muted-foreground text-sm">
				{searchQuery ? (
					<p>
						Showing {startItem}-{endItem} of {totalItems} results for "
						{searchQuery}"
					</p>
				) : (
					<p>
						Showing {startItem}-{endItem} of {totalItems} Pokemon
					</p>
				)}
			</div>

			{/* Pagination controls */}
			<Pagination>
				<PaginationContent>
					{/* Previous button */}
					<PaginationItem>
						<Button
							className="gap-1 pl-2.5"
							disabled={currentPage <= 1 || loading}
							onClick={() => onPageChange(currentPage - 1)}
							size="sm"
							variant="outline"
						>
							<ChevronLeft className="h-4 w-4" />
							Previous
						</Button>
					</PaginationItem>

					{/* Page numbers */}
					{visiblePages.map((page, index) => (
						<PaginationItem key={`page-${page}-${index}`}>
							{page === "ellipsis" ? (
								<PaginationEllipsis />
							) : (
								<Button
									className="h-9 w-9"
									disabled={loading}
									onClick={() => onPageChange(page as number)}
									size="sm"
									variant={page === currentPage ? "primary" : "outline"}
								>
									{page}
								</Button>
							)}
						</PaginationItem>
					))}

					{/* Next button */}
					<PaginationItem>
						<Button
							className="gap-1 pr-2.5"
							disabled={currentPage >= totalPages || loading}
							onClick={() => onPageChange(currentPage + 1)}
							size="sm"
							variant="outline"
						>
							Next
							<ChevronRight className="h-4 w-4" />
						</Button>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{/* Loading indicator */}
			{loading && (
				<div className="flex items-center space-x-2 text-muted-foreground text-sm">
					<div className="h-4 w-4 animate-spin rounded-full border-current border-b-2" />
					<span>Loading...</span>
				</div>
			)}
		</div>
	);
}
