import { Skeleton } from "@/components/ui/skeleton";

interface PokemonCardSkeletonProps {
	count?: number;
}

export function PokemonCardSkeleton({ count = 12 }: PokemonCardSkeletonProps) {
	// Generate unique keys for skeleton items
	const skeletonKeys = Array.from({ length: count }, () => crypto.randomUUID());

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
			{skeletonKeys.map((key) => (
				<div
					className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
					key={key}
				>
					{/* Pokemon Image Skeleton */}
					<div className="mb-3 flex justify-center">
						<Skeleton className="h-24 w-24 rounded-full" />
					</div>

					{/* Pokemon Name Skeleton */}
					<div className="mb-2 text-center">
						<Skeleton className="mx-auto h-5 w-20" />
					</div>

					{/* Pokemon ID Skeleton */}
					<div className="mb-3 text-center">
						<Skeleton className="mx-auto h-4 w-12" />
					</div>

					{/* Pokemon Types Skeleton */}
					<div className="mb-3 flex justify-center gap-1">
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-16 rounded-full" />
					</div>

					{/* Generation Skeleton */}
					<div className="text-center">
						<Skeleton className="mx-auto h-4 w-8" />
					</div>
				</div>
			))}
		</div>
	);
}
