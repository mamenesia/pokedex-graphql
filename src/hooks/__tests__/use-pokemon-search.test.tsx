import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { GET_POKEMON_LIST, SEARCH_POKEMON } from "@/lib/graphql/queries";
import type { GetPokemonListResponse } from "@/lib/types/pokemon";
import { useSearchStore } from "@/stores/search-store";
import { usePokemonSearch } from "../use-pokemon-search";

// ZOMBIE Method: Starting with ZERO - Initial state and empty conditions
describe("usePokemonSearch - ZOMBIE Method Tests", () => {
	// Reset Zustand store before each test to ensure clean initial state
	beforeEach(() => {
		const { reset } = useSearchStore.getState();
		reset();
	});

	// Helper function to create wrapper with mocks
	const createWrapper = (mocks: any[]) => {
		return ({ children }: { children: React.ReactNode }) => (
			<MockedProvider addTypename={false} mocks={mocks}>
				{children}
			</MockedProvider>
		);
	};

	describe("ZERO - Initial state and empty conditions", () => {
		it("should return initial state with zero/empty values", () => {
			// Mock for default empty list
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			// ZERO: Test initial/empty state
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBe(null);
			expect(result.current.searchQuery).toBe("");
			expect(result.current.hasSearched).toBe(false);
			expect(typeof result.current.goToPage).toBe("function");

			// ZERO: Test initial pagination state
			expect(result.current.pagination).toEqual({
				currentPage: 1,
				totalPages: 0,
				totalCount: 0, // Uses allResults.length when no search query
				hasNextPage: false, // allResults.length (0) < totalCount (0) = false
				hasPreviousPage: false,
				pageSize: 20,
			});

			// ZERO: Test function availability
			expect(typeof result.current.handleSearch).toBe("function");
			expect(typeof result.current.clearSearch).toBe("function");
		});

		it("should maintain consistent interface structure", () => {
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			const hookResult = result.current;

			// ZERO: Verify all interface properties exist
			expect(hookResult).toHaveProperty("pokemon");
			expect(hookResult).toHaveProperty("loading");
			expect(hookResult).toHaveProperty("error");
			expect(hookResult).toHaveProperty("searchQuery");
			expect(hookResult).toHaveProperty("handleSearch");
			expect(hookResult).toHaveProperty("clearSearch");
			expect(hookResult).toHaveProperty("hasSearched");
			expect(hookResult).toHaveProperty("pagination");
			expect(hookResult).toHaveProperty("loadMore");
			expect(hookResult).toHaveProperty("loadingMore");
			expect(hookResult).toHaveProperty("canLoadMore");

			// ZERO: Verify correct types
			expect(Array.isArray(hookResult.pokemon)).toBe(true);
			expect(typeof hookResult.loading).toBe("boolean");
			expect(
				hookResult.error === null || typeof hookResult.error === "string"
			).toBe(true);
			expect(typeof hookResult.searchQuery).toBe("string");
			expect(typeof hookResult.handleSearch).toBe("function");
			expect(typeof hookResult.clearSearch).toBe("function");
			expect(typeof hookResult.hasSearched).toBe("boolean");
			expect(typeof hookResult.pagination).toBe("object");
		});
	});

	describe("ONE - Single inputs and basic functionality", () => {
		it("should handle a single search query", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%pika%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 25,
								name: "pikachu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "pikachu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 35, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 1 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			// ONE: Test single search execution
			act(() => {
				result.current.handleSearch("pika");
			});

			// Should update search query immediately
			expect(result.current.searchQuery).toBe("pika");
			expect(result.current.hasSearched).toBe(true);
			expect(result.current.loading).toBe(true);

			// Wait for search results
			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// ONE: Test single result
			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.pokemon[0].name).toBe("pikachu");
			expect(result.current.pokemon[0].id).toBe(25);
			expect(result.current.error).toBe(null);
		});

		it("should handle clearSearch functionality", () => {
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] },
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			// Set a search query first
			act(() => {
				result.current.handleSearch("test");
			});

			expect(result.current.searchQuery).toBe("test");
			expect(result.current.hasSearched).toBe(true);

			// ONE: Test single clear action
			act(() => {
				result.current.clearSearch();
			});

			// Should reset to initial state
			expect(result.current.searchQuery).toBe("");
			expect(result.current.hasSearched).toBe(false);
			expect(result.current.pokemon).toEqual([]);
		});
	});

	describe("MANY - Multiple inputs, results, and batch operations", () => {
		it("should handle multiple search results", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%chu%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 25,
								name: "pikachu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "pikachu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 35, pokemon_v2_stat: { name: "hp" } },
								],
							},
							{
								id: 26,
								name: "raichu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "raichu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 60, pokemon_v2_stat: { name: "hp" } },
								],
							},
							{
								id: 172,
								name: "pichu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "pichu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 20, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 3 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			// MANY: Test search with multiple results
			act(() => {
				result.current.handleSearch("chu");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// MANY: Verify multiple results
			expect(result.current.pokemon).toHaveLength(3);
			expect(result.current.pokemon[0].name).toBe("pikachu");
			expect(result.current.pokemon[1].name).toBe("raichu");
			expect(result.current.pokemon[2].name).toBe("pichu");
			expect(result.current.pagination.totalCount).toBe(3);
		});

		it("should handle multiple consecutive searches", async () => {
			const firstSearchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%pika%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 25,
								name: "pikachu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "pikachu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 35, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 1 },
						},
					},
				},
			};

			const secondSearchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%char%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 4,
								name: "charmander",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "fire" } },
								],
								pokemon_v2_pokemonsprites: [
									{
										sprites: JSON.stringify({
											front_default: "charmander.png",
										}),
									},
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 39, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 1 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([firstSearchMock, secondSearchMock]),
			});

			// MANY: First search
			act(() => {
				result.current.handleSearch("pika");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.pokemon[0].name).toBe("pikachu");
			expect(result.current.searchQuery).toBe("pika");

			// MANY: Second search should replace first results
			act(() => {
				result.current.handleSearch("char");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.pokemon[0].name).toBe("charmander");
			expect(result.current.searchQuery).toBe("char");
		});
	});

	describe("BOUNDARY - Edge cases and limits", () => {
		it("should handle empty search string", async () => {
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 1,
								name: "bulbasaur",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "grass" } },
								],
								pokemon_v2_pokemonsprites: [
									{
										sprites: JSON.stringify({ front_default: "bulbasaur.png" }),
									},
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 45, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			// BOUNDARY: Test empty string search (should load default list)
			act(() => {
				result.current.handleSearch("");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.searchQuery).toBe("");
			expect(result.current.hasSearched).toBe(true);
			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.pokemon[0].name).toBe("bulbasaur");
		});

		it("should handle whitespace-only search string", async () => {
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] },
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			// BOUNDARY: Test whitespace-only search (should be treated as empty)
			act(() => {
				result.current.handleSearch("   ");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.searchQuery).toBe("   ");
			expect(result.current.hasSearched).toBe(true);
			// Should use default list query, not search query
		});

		it("should handle very long search query", async () => {
			const longQuery = "a".repeat(100); // 100 character string
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: `%${longQuery}%`, limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 0 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			// BOUNDARY: Test very long search query
			act(() => {
				result.current.handleSearch(longQuery);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.searchQuery).toBe(longQuery);
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.pagination.totalCount).toBe(0);
		});

		it("should handle search with no results", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%nonexistentpokemon%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 0 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			// BOUNDARY: Test search with zero results
			act(() => {
				result.current.handleSearch("nonexistentpokemon");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.pokemon).toEqual([]);
			expect(result.current.pagination.totalCount).toBe(0);
			expect(result.current.pagination.totalPages).toBe(0);
		});
	});

	describe("INTERFACE - API contracts and integration points", () => {
		it("should maintain stable interface across multiple renders", () => {
			const defaultListMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] },
				},
			};

			const { result, rerender } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListMock]),
			});

			const firstRender = result.current;

			// INTERFACE: Rerender should maintain same function references
			rerender();
			const secondRender = result.current;

			// Function references should be stable
			expect(firstRender.handleSearch).toBe(secondRender.handleSearch);
			expect(firstRender.clearSearch).toBe(secondRender.clearSearch);
		});

		it("should maintain consistent pagination interface", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%test%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 1,
								name: "test-pokemon",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "normal" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "test.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 50, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 25 }, // More than one page
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			act(() => {
				result.current.handleSearch("test");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// INTERFACE: Pagination should have consistent structure
			const pagination = result.current.pagination;
			expect(pagination).toHaveProperty("currentPage");
			expect(pagination).toHaveProperty("totalPages");
			expect(pagination).toHaveProperty("totalCount");
			expect(pagination).toHaveProperty("hasNextPage");
			expect(pagination).toHaveProperty("hasPreviousPage");
			expect(pagination).toHaveProperty("pageSize");

			// INTERFACE: Values should be consistent with data
			expect(pagination.currentPage).toBe(1);
			expect(pagination.totalCount).toBe(25);
			expect(pagination.totalPages).toBe(2); // Math.ceil(25/20)
			expect(pagination.hasNextPage).toBe(true); // 1 < 25
			expect(pagination.hasPreviousPage).toBe(false);
			expect(pagination.pageSize).toBe(20);
		});

		it("should maintain consistent loading states interface", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%loading%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 0 },
						},
					},
				},
				delay: 100, // Add delay to test loading state
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			// INTERFACE: Initial loading states
			expect(result.current.loading).toBe(false);

			act(() => {
				result.current.handleSearch("loading");
			});

			// INTERFACE: During search loading states
			expect(result.current.loading).toBe(true);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// INTERFACE: After search loading states
			expect(result.current.loading).toBe(false);
		});

		it("should maintain consistent error interface", async () => {
			const errorMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%error%", limit: 20, offset: 0 },
				},
				error: new Error("Network error occurred"),
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([errorMock]),
			});

			act(() => {
				result.current.handleSearch("error");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// INTERFACE: Error should be string or null
			expect(
				typeof result.current.error === "string" ||
					result.current.error === null
			).toBe(true);
			expect(result.current.error).toBe("Network error occurred");
			expect(result.current.pokemon).toEqual([]);
		});
	});

	describe("EXERCISE - Error conditions and exception handling", () => {
		it("should handle GraphQL network errors gracefully", async () => {
			const networkErrorMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%network%", limit: 20, offset: 0 },
				},
				error: new Error("Network request failed"),
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([networkErrorMock]),
			});

			act(() => {
				result.current.handleSearch("network");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should handle network error gracefully
			expect(result.current.error).toBe("Network request failed");
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.hasSearched).toBe(true);
			expect(result.current.searchQuery).toBe("network");
		});

		it("should handle GraphQL server errors gracefully", async () => {
			const serverErrorMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%server%", limit: 20, offset: 0 },
				},
				result: {
					errors: [{ message: "Internal server error" }],
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([serverErrorMock]),
			});

			act(() => {
				result.current.handleSearch("server");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should handle server error gracefully
			expect(result.current.error).toContain("Internal server error");
			expect(result.current.pokemon).toEqual([]);
		});

		it("should handle malformed GraphQL response data", async () => {
			const malformedDataMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%malformed%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						// Missing pokemon_v2_pokemon_aggregate - malformed response
						pokemon_v2_pokemon: [
							{
								id: 1,
								name: "test",
								// Missing required fields - malformed Pokemon object
							},
						],
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([malformedDataMock]),
			});

			act(() => {
				result.current.handleSearch("malformed");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should handle malformed data gracefully
			// Hook should still function even with incomplete data
			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.error).toBe(null); // No error thrown
			expect(result.current.pagination.totalCount).toBe(0); // Defaults to 0 when aggregate missing
		});

		it("should handle timeout errors gracefully", async () => {
			const timeoutErrorMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%timeout%", limit: 20, offset: 0 },
				},
				error: new Error("Request timeout"),
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([timeoutErrorMock]),
			});

			act(() => {
				result.current.handleSearch("timeout");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should handle timeout gracefully
			expect(result.current.error).toBe("Request timeout");
			expect(result.current.pokemon).toEqual([]);
		});

		it("should recover from errors on subsequent searches", async () => {
			const errorMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%error%", limit: 20, offset: 0 },
				},
				error: new Error("First search failed"),
			};

			const successMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%success%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{
								id: 25,
								name: "pikachu",
								pokemon_v2_pokemontypes: [
									{ pokemon_v2_type: { name: "electric" } },
								],
								pokemon_v2_pokemonsprites: [
									{ sprites: JSON.stringify({ front_default: "pikachu.png" }) },
								],
								pokemon_v2_pokemonstats: [
									{ base_stat: 35, pokemon_v2_stat: { name: "hp" } },
								],
							},
						],
						pokemon_v2_pokemon_aggregate: {
							aggregate: { count: 1 },
						},
					},
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([errorMock, successMock]),
			});

			// EXERCISE: First search fails
			act(() => {
				result.current.handleSearch("error");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("First search failed");
			expect(result.current.pokemon).toEqual([]);

			// EXERCISE: Second search should recover and succeed
			act(() => {
				result.current.handleSearch("success");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe(null); // Error cleared
			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.pokemon[0].name).toBe("pikachu");
		});

		it("should handle errors in default list loading", async () => {
			const defaultListErrorMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				error: new Error("Failed to load default list"),
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([defaultListErrorMock]),
			});

			// EXERCISE: Test error in default list (empty search)
			act(() => {
				result.current.handleSearch("");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load default list");
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.searchQuery).toBe("");
		});
	});
});
