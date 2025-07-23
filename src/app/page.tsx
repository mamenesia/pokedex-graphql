"use client";

import FilterContainer from "@/components/filters/FilterContainer";
import { ComparisonBar } from "@/components/pokemon/comparison-bar";
import { SearchInputWithSuggestions } from "@/components/search/search-input-with-suggestions";
import { SearchResults } from "@/components/search/search-results";
import { SortDropdown } from "@/components/sorting/sort-dropdown";
import { usePokemonSearch } from "@/hooks/use-pokemon-search";
import type { Pokemon, SearchSuggestion } from "@/lib/types/pokemon";

export default function HomePage() {
	// Full search functionality with Zustand state management
	const { handleSearch, clearSearch, goToPage } = usePokemonSearch();

	const handlePokemonClick = (data: Pokemon) => {
		console.log("Pokemon clicked:", data.name);
	};

	const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
		console.log("Suggestion selected:", suggestion.name);
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="mb-2 font-bold text-4xl text-foreground">
						GraphQL Pokedex
					</h1>
					<p className="text-muted-foreground">
						Discover and search Pokemon using GraphQL with smart suggestions
					</p>
				</div>

				{/* Enhanced Search Section with Suggestions */}
				<div className="mx-auto mb-8 max-w-md">
					<SearchInputWithSuggestions
						className="w-full"
						onSearch={handleSearch}
						onSuggestionSelect={handleSuggestionSelect}
						placeholder="Search Pokemon by name..."
					/>
				</div>

				{/* Filter Section */}
				<div className="mx-auto mb-8 max-w-4xl">
					<FilterContainer />
				</div>

				{/* Sort Section */}
				<div className="mx-auto mb-6 max-w-4xl">
					<div className="flex justify-end">
						<SortDropdown />
					</div>
				</div>

				{/* Search Results with Pagination */}
				<SearchResults
					onClearSearch={clearSearch}
					onGoToPage={goToPage}
					onPokemonClick={handlePokemonClick}
				/>
			</div>

			{/* Comparison Bar - Fixed at bottom */}
			<ComparisonBar />
		</div>
	);
}
