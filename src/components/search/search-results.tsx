import Image from "next/image";
import { SortedPokemonList } from "@/components/pokemon/sorted-pokemon-list";
import { PokemonPagination } from "@/components/search/pokemon-pagination";
import { Button } from "@/components/ui/button";
import { PaginationSkeleton } from "@/components/ui/pagination-skeleton";
import { POKEBALL_PLACEHOLDER } from "@/data/constants/assets";
import type { PaginationInfo, Pokemon } from "@/lib/types/pokemon";
import { useSearchStore } from "@/stores/search-store";

interface SearchResultsProps {
	// Optional callback props for flexibility
	onPokemonClick?: (pokemon: Pokemon) => void;
	onClearSearch?: () => void;
	onGoToPage?: (page: number) => void;
}

// Loading state component
function LoadingState({ searchQuery }: { searchQuery: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			{/* pokeball placeholder gif */}
			<Image
				alt="Pokeball"
				height={100}
				src={POKEBALL_PLACEHOLDER}
				width={100}
			/>
			<p className="text-muted-foreground">
				{searchQuery
					? `Searching for "${searchQuery}"...`
					: "Loading Pokemon..."}
			</p>
		</div>
	);
}

// Error state component
function ErrorState({
	error,
	onClearSearch,
}: {
	error: string;
	onClearSearch?: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="text-center">
				<div className="mb-4 text-4xl">⚠️</div>
				<h3 className="mb-2 font-medium text-destructive text-lg">
					Search Error
				</h3>
				<p className="mb-4 text-muted-foreground">{error}</p>
				{onClearSearch && (
					<Button onClick={onClearSearch} variant="outline">
						Try Again
					</Button>
				)}
			</div>
		</div>
	);
}

// Empty results component
function EmptyResults({
	searchQuery,
	onClearSearch,
}: {
	searchQuery: string;
	onClearSearch?: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="text-center">
				<div className="mb-4 text-4xl">🔍</div>
				<h3 className="mb-2 font-medium text-lg">No Pokemon Found</h3>
				<p className="mb-4 text-muted-foreground">
					No Pokemon found matching "{searchQuery}". Try a different search
					term.
				</p>
				{onClearSearch && (
					<Button onClick={onClearSearch} variant="outline">
						Clear Search
					</Button>
				)}
			</div>
		</div>
	);
}

// Search results header component
function SearchResultsHeader({
	searchQuery,
	pokemonCount,
	pagination,
	onClearSearch,
}: {
	searchQuery: string;
	pokemonCount: number;
	pagination: PaginationInfo;
	onClearSearch?: () => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h2 className="font-semibold text-lg">
					Search Results for "{searchQuery}"
				</h2>
				<p className="text-muted-foreground text-sm">
					Showing {pokemonCount} of {pagination.totalCount} Pokemon
					{pagination.totalPages > 1 && (
						<span className="ml-2">
							(Page {pagination.currentPage} of {pagination.totalPages})
						</span>
					)}
				</p>
			</div>
			{onClearSearch && (
				<Button onClick={onClearSearch} size="sm" variant="ghost">
					Clear Search
				</Button>
			)}
		</div>
	);
}

// Default list header component
function DefaultListHeader({ pokemonCount }: { pokemonCount: number }) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h2 className="font-semibold text-lg">All Pokemon</h2>
				<p className="text-muted-foreground text-sm">
					Showing {pokemonCount} Pokemon
				</p>
			</div>
		</div>
	);
}

// End of results message component
function EndOfResultsMessage({
	searchQuery,
	totalCount,
}: {
	searchQuery: string;
	totalCount: number;
}) {
	return (
		<div className="flex justify-center pt-6">
			<p className="text-muted-foreground text-sm">
				🎉 You've seen all {totalCount} results for "{searchQuery}"
			</p>
		</div>
	);
}

export function SearchResults({
	onClearSearch,
	onGoToPage,
}: SearchResultsProps) {
	// Get all state from Zustand store
	const { pokemon, loading, error, searchQuery, hasSearched, pagination } =
		useSearchStore();

	// Loading state
	if (loading) {
		return <LoadingState searchQuery={searchQuery} />;
	}

	if (error) {
		return <ErrorState error={error} onClearSearch={onClearSearch} />;
	}

	// Empty search results
	if (!loading && searchQuery && pokemon.length === 0) {
		return (
			<EmptyResults onClearSearch={onClearSearch} searchQuery={searchQuery} />
		);
	}

	// Success state with results
	const showSearchHeader = hasSearched && searchQuery;
	const showDefaultHeader = !hasSearched && pokemon.length > 0;
	const showEndMessage =
		pagination.totalPages > 0 &&
		pagination.currentPage >= pagination.totalPages &&
		pokemon.length > 0 &&
		hasSearched &&
		searchQuery;

	return (
		<div className="space-y-6">
			{/* Search Results Header */}
			{showSearchHeader && (
				<SearchResultsHeader
					onClearSearch={onClearSearch}
					pagination={pagination}
					pokemonCount={pokemon.length}
					searchQuery={searchQuery}
				/>
			)}

			{/* Default List Header */}
			{showDefaultHeader && <DefaultListHeader pokemonCount={pokemon.length} />}

			{/* Pokemon List with Sorting */}
			<SortedPokemonList error={error} loading={loading} pokemon={pokemon} />

			{/* Pagination Section */}
			{loading ? (
				<PaginationSkeleton />
			) : (
				pokemon.length > 0 &&
				onGoToPage && (
					<PokemonPagination
						currentPage={pagination.currentPage}
						itemsPerPage={pagination.pageSize}
						loading={loading}
						onPageChange={onGoToPage}
						searchQuery={searchQuery}
						totalItems={pagination.totalCount}
						totalPages={pagination.totalPages}
					/>
				)
			)}

			{/* End of Results Message */}
			{showEndMessage && (
				<EndOfResultsMessage
					searchQuery={searchQuery}
					totalCount={pagination.totalCount}
				/>
			)}
		</div>
	);
}
