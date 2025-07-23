import { Skeleton } from "@/components/ui/skeleton";

export function PaginationSkeleton() {
	return (
		<div className="flex items-center justify-between border-t bg-white px-4 py-3 sm:px-6">
			{/* Mobile pagination info skeleton */}
			<div className="flex flex-1 justify-between sm:hidden">
				<Skeleton className="h-9 w-20" />
				<Skeleton className="h-9 w-16" />
			</div>

			{/* Desktop pagination skeleton */}
			<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
				{/* Results info skeleton */}
				<div>
					<Skeleton className="h-5 w-48" />
				</div>

				{/* Pagination controls skeleton */}
				<div>
					<nav className="-space-x-px isolate inline-flex rounded-md shadow-sm">
						{/* Previous button skeleton */}
						<Skeleton className="h-10 w-20" />

						{/* Page number skeletons */}
						{Array.from({ length: 5 }, () => (
							<Skeleton className="h-10 w-10" key={crypto.randomUUID()} />
						))}

						{/* Next button skeleton */}
						<Skeleton className="h-10 w-16" />
					</nav>
				</div>
			</div>
		</div>
	);
}
