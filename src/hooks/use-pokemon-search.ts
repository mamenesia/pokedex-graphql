/** biome-ignore-all lint/style/noNestedTernary: <explanation> */
import { useLazyQuery } from "@apollo/client";
import { useCallback, useEffect } from "react";
import {
	GET_POKEMON_BY_TYPES,
	GET_POKEMON_LIST,
	SEARCH_POKEMON,
} from "@/lib/graphql/queries";
import {
	GET_FILTERED_POKEMON_LIST,
	GET_POKEMON_BY_GENERATIONS,
} from "@/lib/graphql/queries-additions";
import type {
	GetPokemonListResponse,
	PaginationInfo,
	Pokemon,
	SearchPokemonResponse,
} from "@/lib/types/pokemon";
import { getSortOrderBy } from "@/lib/utils/graphql-sorting";
import { useSearchStore } from "@/stores/search-store";

interface UsePokemonSearchResult {
	pokemon: Pokemon[];
	loading: boolean;
	error: string | null;
	searchQuery: string;
	handleSearch: (query: string) => void;
	clearSearch: () => void;
	hasSearched: boolean;
	// Pagination features
	pagination: PaginationInfo;
	goToPage: (page: number) => void;
	// User preferences
	preferences: {
		showStats: boolean;
	};
}

const DEFAULT_PAGE_SIZE = 20;

export function usePokemonSearch(): UsePokemonSearchResult {
	// Get state from Zustand store
	const {
		searchQuery,
		hasSearched,
		filters,
		sort,
		pagination,
		preferences,
		setSearchQuery,
		setHasSearched,
		setCurrentPage,
		setPokemon,
		updatePaginationWithResults,
		clearSearch: storeClearSearch,
	} = useSearchStore();

	// GraphQL lazy queries
	const [
		executeMainQuery,
		{ data: mainData, loading: mainLoading, error: mainError },
	] = useLazyQuery<GetPokemonListResponse>(GET_POKEMON_LIST, {
		fetchPolicy: "cache-first",
		errorPolicy: "all",
	});

	const [
		executeFilteredQuery,
		{ data: filteredData, loading: filteredLoading, error: filteredError },
	] = useLazyQuery<GetPokemonListResponse>(GET_POKEMON_BY_TYPES, {
		fetchPolicy: "cache-first",
		errorPolicy: "all",
	});

	const [
		executeGenerationQuery,
		{
			data: generationData,
			loading: generationLoading,
			error: generationError,
		},
	] = useLazyQuery<GetPokemonListResponse>(GET_POKEMON_BY_GENERATIONS, {
		fetchPolicy: "cache-first",
		errorPolicy: "all",
	});

	const [
		executeSearchQuery,
		{ data: searchData, loading: searchLoading, error: searchError },
	] = useLazyQuery<SearchPokemonResponse>(SEARCH_POKEMON, {
		fetchPolicy: "cache-first",
		errorPolicy: "all",
	});

	const [
		executeCombinedQuery,
		{ data: combinedData, loading: combinedLoading, error: combinedError },
	] = useLazyQuery<GetPokemonListResponse>(GET_FILTERED_POKEMON_LIST, {
		fetchPolicy: "cache-first",
		errorPolicy: "all",
	});

	// Helper function to execute the appropriate query based on current state
	const executeQuery = useCallback(async () => {
		const hasTypes = filters.types.length > 0;
		const hasGenerations = filters.generations.length > 0;
		const hasSearch = hasSearched && searchQuery.trim();

		const offset = (pagination.currentPage - 1) * DEFAULT_PAGE_SIZE;
		const orderBy = getSortOrderBy(sort.sortBy);

		console.log("📊 ExecuteQuery:", {
			hasTypes,
			hasGenerations,
			hasSearch,
			sortBy: sort.sortBy,
			orderBy,
			offset,
			currentPage: pagination.currentPage,
		});

		if (hasSearch) {
			// Search query takes priority
			await executeSearchQuery({
				variables: {
					searchTerm: `%${searchQuery.trim()}%`,
					limit: DEFAULT_PAGE_SIZE,
					offset,
					orderBy,
				},
				fetchPolicy: "network-only",
			});
		} else if (hasTypes && hasGenerations) {
			// Combined type and generation filtering
			await executeCombinedQuery({
				variables: {
					limit: DEFAULT_PAGE_SIZE,
					offset,
					types: filters.types,
					generations: filters.generations,
					orderBy,
				},
				fetchPolicy: "network-only",
			});
		} else if (hasTypes) {
			// Type filtering only
			console.log("🔥 Executing type filter query with types:", filters.types);
			await executeFilteredQuery({
				variables: {
					limit: DEFAULT_PAGE_SIZE,
					offset,
					types: filters.types,
					generations: [], // Empty array for no generation filtering
					orderBy,
				},
				fetchPolicy: "network-only",
			});
		} else if (hasGenerations) {
			// Generation filtering only
			await executeGenerationQuery({
				variables: {
					limit: DEFAULT_PAGE_SIZE,
					offset,
					generations: filters.generations,
					orderBy,
				},
				fetchPolicy: "network-only",
			});
		} else {
			// No filters, get all Pokemon
			console.log("🚀 Executing main query with variables:", {
				limit: DEFAULT_PAGE_SIZE,
				offset,
				orderBy,
			});
			await executeMainQuery({
				variables: {
					limit: DEFAULT_PAGE_SIZE,
					offset,
					orderBy,
				},
				fetchPolicy: "network-only",
			});
		}
	}, [
		filters.types,
		filters.generations,
		hasSearched,
		searchQuery,
		pagination.currentPage,
		sort.sortBy,
		executeMainQuery,
		executeFilteredQuery,
		executeGenerationQuery,
		executeSearchQuery,
		executeCombinedQuery,
	]);

	// Execute query when filters or sort change
	useEffect(() => {
		console.log(
			"🔄 Filters or sort changed, executing query. Sort:",
			sort.sortBy,
			"filters:",
			filters
		);
		executeQuery();
	}, [executeQuery, filters, sort.sortBy]);

	// Execute search query when search query changes
	useEffect(() => {
		if (hasSearched && searchQuery.trim()) {
			console.log("🔍 Search query changed, executing search:", searchQuery);
			const searchPattern = `%${searchQuery.trim()}%`; // Add wildcards for _ilike operator
			executeSearchQuery({
				variables: {
					name: searchPattern,
					limit: DEFAULT_PAGE_SIZE,
					offset: (pagination.currentPage - 1) * DEFAULT_PAGE_SIZE,
					orderBy: getSortOrderBy(sort.sortBy),
				},
			});
		}
	}, [
		searchQuery,
		hasSearched,
		executeSearchQuery,
		pagination.currentPage,
		sort.sortBy,
	]);

	// Get current data and loading/error states
	const getCurrentData = useCallback(() => {
		const hasTypes = filters.types.length > 0;
		const hasGenerations = filters.generations.length > 0;
		const hasSearch = hasSearched && searchQuery.trim();

		if (hasSearch) {
			return {
				data: searchData,
				loading: searchLoading,
				error: searchError,
			};
		}
		if (hasTypes && hasGenerations) {
			return {
				data: combinedData,
				loading: combinedLoading,
				error: combinedError,
			};
		}
		if (hasTypes) {
			return {
				data: filteredData,
				loading: filteredLoading,
				error: filteredError,
			};
		}
		if (hasGenerations) {
			return {
				data: generationData,
				loading: generationLoading,
				error: generationError,
			};
		}
		return {
			data: mainData,
			loading: mainLoading,
			error: mainError,
		};
	}, [
		filters.types,
		filters.generations,
		hasSearched,
		searchQuery,
		searchData,
		searchLoading,
		searchError,
		combinedData,
		combinedLoading,
		combinedError,
		filteredData,
		filteredLoading,
		filteredError,
		generationData,
		generationLoading,
		generationError,
		mainData,
		mainLoading,
		mainError,
	]);

	const { data, loading, error } = getCurrentData();

	// Update pagination and Pokemon data when data changes
	useEffect(() => {
		if (data) {
			const pokemonData =
				"pokemon_v2_pokemon" in data ? data.pokemon_v2_pokemon : [];

			// Get total count from GraphQL aggregate if available, otherwise use current results length
			let totalCount = pokemonData.length;

			if (
				"pokemon_v2_pokemon_aggregate" in data &&
				data.pokemon_v2_pokemon_aggregate
			) {
				const aggregateData = data.pokemon_v2_pokemon_aggregate as {
					aggregate?: { count?: number };
				};
				totalCount = aggregateData.aggregate?.count || pokemonData.length;
			}

			console.log("📊 Pagination update:", {
				currentResults: pokemonData.length,
				totalCount,
				hasAggregate: "pokemon_v2_pokemon_aggregate" in data,
			});

			// Update both pagination and Pokemon data in store
			updatePaginationWithResults(pokemonData, totalCount);
			setPokemon(pokemonData);
		}
	}, [data, updatePaginationWithResults, setPokemon]);

	// Extract Pokemon array from data
	const pokemon: Pokemon[] = data
		? "pokemon_v2_pokemon" in data
			? data.pokemon_v2_pokemon
			: []
		: [];

	// Format error message
	const errorMessage = error?.message || (error ? String(error) : null);

	// Handle search
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);
			setHasSearched(true);
			setCurrentPage(1); // Reset to first page when searching
		},
		[setSearchQuery, setHasSearched, setCurrentPage]
	);

	// Clear search
	const clearSearch = useCallback(() => {
		storeClearSearch();
		setCurrentPage(1); // Reset to first page when clearing
	}, [storeClearSearch, setCurrentPage]);

	// Go to page
	const goToPage = useCallback(
		(page: number) => {
			setCurrentPage(page);
		},
		[setCurrentPage]
	);

	return {
		pokemon,
		loading,
		error: errorMessage,
		searchQuery,
		handleSearch,
		clearSearch,
		hasSearched,
		pagination,
		goToPage,
		preferences,
	};
}
