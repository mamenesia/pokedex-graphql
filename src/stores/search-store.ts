import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PaginationInfo, Pokemon } from "@/lib/types/pokemon";

// Filter types
export interface PokemonFilters {
	types: string[]; // Selected Pokemon types (e.g., ["fire", "water"])
	generations: number[]; // Selected generations (e.g., [1, 2, 3])
}

// Sort options
export type SortOption =
	| "name-asc"
	| "name-desc"
	| "id-asc"
	| "id-desc"
	| "hp-asc"
	| "hp-desc"
	| "attack-asc"
	| "attack-desc";

export interface SortState {
	sortBy: SortOption;
}

// Define the shape of our search state
interface SearchState {
	// Search data
	searchQuery: string;
	pokemon: Pokemon[];
	hasSearched: boolean;

	// Loading and error states (should NOT persist)
	loading: boolean;
	loadingMore: boolean;
	error: string | null;

	// Pagination (enhanced for full support)
	pagination: PaginationInfo;
	canLoadMore: boolean;
	// Note: currentOffset can be calculated as (pagination.currentPage - 1) * pagination.pageSize
	// Note: totalCount is available as pagination.totalCount

	// Filtering and sorting (should NOT persist - session only)
	filters: PokemonFilters;
	sort: SortState;
	hasActiveFilters: boolean; // Computed state to check if any filters are active

	// User preferences (SHOULD persist)
	preferences: {
		showStats: boolean; // Whether to show stats on Pokemon cards
	};

	// Pokemon comparison (SHOULD persist)
	comparison: {
		selectedPokemon: Pokemon[]; // Pokemon selected for comparison (max 4)
		isComparing: boolean; // Whether comparison view is active
	};
}

// Define the actions our store can perform
interface SearchActions {
	// Basic actions
	setSearchQuery: (query: string) => void;
	setPokemon: (pokemon: Pokemon[]) => void;
	appendPokemon: (pokemon: Pokemon[]) => void; // For "Load More" functionality
	setHasSearched: (hasSearched: boolean) => void;

	// Loading and error actions
	setLoading: (loading: boolean) => void;
	setLoadingMore: (loadingMore: boolean) => void;
	setError: (error: string | null) => void;

	// Enhanced pagination actions
	setPagination: (pagination: PaginationInfo) => void;
	setCanLoadMore: (canLoadMore: boolean) => void;
	setCurrentPage: (page: number) => void;

	// Helper functions for pagination calculations
	incrementPage: () => void; // Increment current page for "Load More"
	updatePaginationWithResults: (
		newPokemon: Pokemon[],
		totalCount: number
	) => void; // Update pagination after loading results

	// Filter and sort actions
	setFilters: (filters: Partial<PokemonFilters>) => void;
	addTypeFilter: (type: string) => void;
	removeTypeFilter: (type: string) => void;
	addGenerationFilter: (generation: number) => void;
	removeGenerationFilter: (generation: number) => void;
	clearFilters: () => void;
	setSortBy: (sortBy: SortOption) => void;

	// Preferences actions
	setPreferences: (preferences: Partial<SearchState["preferences"]>) => void;

	// Pokemon comparison actions
	addToComparison: (pokemon: Pokemon) => void;
	removeFromComparison: (pokemonId: number) => void;
	clearComparison: () => void;
	toggleComparison: () => void;
	isInComparison: (pokemonId: number) => boolean;

	// Utility actions
	clearSearch: () => void;
	reset: () => void;
}

// Combine state and actions
type SearchStore = SearchState & SearchActions;

// Constants
const DEFAULT_PAGE_SIZE = 20;

// Initial state
const initialState: SearchState = {
	searchQuery: "",
	pokemon: [],
	hasSearched: false,
	loading: false,
	loadingMore: false,
	error: null,
	pagination: {
		currentPage: 1,
		totalPages: 0,
		totalCount: 0,
		hasNextPage: false,
		hasPreviousPage: false,
		pageSize: DEFAULT_PAGE_SIZE,
	},
	canLoadMore: true, // For default list, we allow loading more initially
	filters: {
		types: [],
		generations: [],
	},
	sort: {
		sortBy: "id-asc", // Default sort by Pokedex number ascending
	},
	hasActiveFilters: false, // Initially no filters are active
	preferences: {
		showStats: true,
	},
	comparison: {
		selectedPokemon: [],
		isComparing: false,
	},
};

// Create the Zustand store with selective persistence
export const useSearchStore = create<SearchStore>()(
	devtools(
		persist(
			(set, _get) => ({
				// Initial state
				...initialState,

				// Actions
				setSearchQuery: (query) =>
					set({ searchQuery: query }, false, "setSearchQuery"),

				setPokemon: (pokemon) => set({ pokemon }, false, "setPokemon"),

				appendPokemon: (newPokemon) =>
					set(
						(state) => ({
							pokemon: [...state.pokemon, ...newPokemon],
						}),
						false,
						"appendPokemon"
					),

				setHasSearched: (hasSearched) =>
					set({ hasSearched }, false, "setHasSearched"),

				setLoading: (loading) => set({ loading }, false, "setLoading"),

				setLoadingMore: (loadingMore) =>
					set({ loadingMore }, false, "setLoadingMore"),

				setError: (error) => set({ error }, false, "setError"),

				setPagination: (pagination) =>
					set({ pagination }, false, "setPagination"),

				setCanLoadMore: (canLoadMore) =>
					set({ canLoadMore }, false, "setCanLoadMore"),

				setCurrentPage: (page) =>
					set(
						(state) => ({
							pagination: {
								...state.pagination,
								currentPage: page,
								hasNextPage: page < state.pagination.totalPages,
								hasPreviousPage: page > 1,
							},
						}),
						false,
						"setCurrentPage"
					),

				// Helper functions for pagination calculations
				incrementPage: () =>
					set(
						(state) => ({
							pagination: {
								...state.pagination,
								currentPage: state.pagination.currentPage + 1,
							},
						}),
						false,
						"incrementPage"
					),

				updatePaginationWithResults: (_, totalCount) =>
					set(
						(state) => {
							const pageSize = state.pagination.pageSize;
							const currentPage = state.pagination.currentPage; // Keep current page as-is
							const totalPages = Math.ceil(totalCount / pageSize);

							return {
								pagination: {
									...state.pagination,
									totalPages,
									totalCount,
									hasNextPage: currentPage < totalPages,
									hasPreviousPage: currentPage > 1,
								},
								canLoadMore: currentPage < totalPages, // Based on pages, not results
							};
						},
						false,
						"updatePaginationWithResults"
					),

				setPreferences: (newPreferences) =>
					set(
						(state) => ({
							preferences: { ...state.preferences, ...newPreferences },
						}),
						false,
						"setPreferences"
					),

				// Filter and sort actions
				setFilters: (newFilters) =>
					set(
						(state) => {
							const updatedFilters = { ...state.filters, ...newFilters };
							const hasActiveFilters =
								updatedFilters.types.length > 0 ||
								updatedFilters.generations.length > 0;
							return {
								filters: updatedFilters,
								hasActiveFilters,
							};
						},
						false,
						"setFilters"
					),

				addTypeFilter: (type) =>
					set(
						(state) => {
							if (state.filters.types.includes(type)) {
								return state;
							}
							const updatedTypes = [...state.filters.types, type];
							const updatedFilters = { ...state.filters, types: updatedTypes };
							const hasActiveFilters =
								updatedTypes.length > 0 || state.filters.generations.length > 0;
							return {
								filters: updatedFilters,
								hasActiveFilters,
							};
						},
						false,
						"addTypeFilter"
					),

				removeTypeFilter: (type) =>
					set(
						(state) => {
							const updatedTypes = state.filters.types.filter(
								(t) => t !== type
							);
							const updatedFilters = { ...state.filters, types: updatedTypes };
							const hasActiveFilters =
								updatedTypes.length > 0 || state.filters.generations.length > 0;
							return {
								filters: updatedFilters,
								hasActiveFilters,
							};
						},
						false,
						"removeTypeFilter"
					),

				addGenerationFilter: (generation) =>
					set(
						(state) => {
							if (state.filters.generations.includes(generation)) {
								return state;
							}
							const updatedGenerations = [
								...state.filters.generations,
								generation,
							];
							const updatedFilters = {
								...state.filters,
								generations: updatedGenerations,
							};
							const hasActiveFilters =
								state.filters.types.length > 0 || updatedGenerations.length > 0;
							return {
								filters: updatedFilters,
								hasActiveFilters,
							};
						},
						false,
						"addGenerationFilter"
					),

				removeGenerationFilter: (generation) =>
					set(
						(state) => {
							const updatedGenerations = state.filters.generations.filter(
								(g) => g !== generation
							);
							const updatedFilters = {
								...state.filters,
								generations: updatedGenerations,
							};
							const hasActiveFilters =
								state.filters.types.length > 0 || updatedGenerations.length > 0;
							return {
								filters: updatedFilters,
								hasActiveFilters,
							};
						},
						false,
						"removeGenerationFilter"
					),

				clearFilters: () =>
					set(
						{
							filters: {
								types: [],
								generations: [],
							},
							hasActiveFilters: false,
						},
						false,
						"clearFilters"
					),

				setSortBy: (sortBy) =>
					set(
						{
							sort: { sortBy },
						},
						false,
						"setSortBy"
					),

				clearSearch: () =>
					set(
						{
							searchQuery: "",
							pokemon: [],
							hasSearched: false,
							loading: false,
							loadingMore: false,
							error: null,
							pagination: initialState.pagination,
							canLoadMore: false,
							// Keep preferences when clearing search
						},
						false,
						"clearSearch"
					),

				// Pokemon comparison actions
				addToComparison: (pokemon) =>
					set(
						(state) => {
							// Don't add if already in comparison or if we already have 4 Pokemon
							if (
								state.comparison.selectedPokemon.some(
									(p) => p.id === pokemon.id
								) ||
								state.comparison.selectedPokemon.length >= 4
							) {
								return state;
							}
							return {
								...state,
								comparison: {
									...state.comparison,
									selectedPokemon: [
										...state.comparison.selectedPokemon,
										pokemon,
									],
								},
							};
						},
						false,
						"addToComparison"
					),

				removeFromComparison: (pokemonId) =>
					set(
						(state) => ({
							...state,
							comparison: {
								...state.comparison,
								selectedPokemon: state.comparison.selectedPokemon.filter(
									(p) => p.id !== pokemonId
								),
							},
						}),
						false,
						"removeFromComparison"
					),

				clearComparison: () =>
					set(
						(state) => ({
							...state,
							comparison: {
								selectedPokemon: [],
								isComparing: false,
							},
						}),
						false,
						"clearComparison"
					),

				toggleComparison: () =>
					set(
						(state) => ({
							...state,
							comparison: {
								...state.comparison,
								isComparing: !state.comparison.isComparing,
							},
						}),
						false,
						"toggleComparison"
					),

				isInComparison: (pokemonId) => {
					const state = _get();
					return state.comparison.selectedPokemon.some(
						(p) => p.id === pokemonId
					);
				},

				reset: () => set(initialState, false, "reset"),
			}),
			{
				name: "search-store", // localStorage key
				// Persist user preferences, search state, filters, and sort for complete state restoration
				partialize: (state) => ({
					preferences: state.preferences,
					// Persist complete search context for better UX
					searchQuery: state.searchQuery,
					filters: state.filters,
					sort: state.sort,
					// Keep track if user had searched before
					hasSearched: state.hasSearched,
					// Persist comparison selections
					comparison: state.comparison,
				}),
				// Reset loading states and computed states on hydration
				onRehydrateStorage: () => (state) => {
					if (state) {
						// Reset loading and error states
						state.loading = false;
						state.loadingMore = false;
						state.error = null;

						// Reset data that should be fetched fresh
						state.pokemon = [];
						state.canLoadMore = false;
						state.pagination = initialState.pagination;

						// Update computed hasActiveFilters based on restored filters
						state.hasActiveFilters =
							(state.filters?.types?.length || 0) > 0 ||
							(state.filters?.generations?.length || 0) > 0;
					}
				},
			}
		),
		{
			name: "search-store", // Name for Redux DevTools
		}
	)
);
