import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook, waitFor } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { GET_POKEMON_LIST, SEARCH_POKEMON } from "@/lib/graphql/queries";
import type { GetPokemonListResponse } from "@/lib/types/pokemon";
import { useSearchStore } from "@/stores/search-store";
import { usePokemonSearch } from "../use-pokemon-search";

// ZOMBIE Method Tests for Pagination Functionality
describe("usePokemonSearch - Pagination ZOMBIE Tests", () => {
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

	// Mock Pokemon data for testing
	const mockPokemon = [
		{ id: 1, name: "bulbasaur", height: 7, weight: 69 },
		{ id: 2, name: "ivysaur", height: 10, weight: 130 },
		{ id: 3, name: "venusaur", height: 20, weight: 1000 },
	];

	const mockPokemonPage2 = [
		{ id: 4, name: "charmander", height: 6, weight: 85 },
		{ id: 5, name: "charmeleon", height: 11, weight: 190 },
		{ id: 6, name: "charizard", height: 17, weight: 905 },
	];

	describe("ZERO - Initial pagination state", () => {
		it("should return initial pagination state with zero values", () => {
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

			// ZERO: Test initial pagination state
			expect(result.current.pagination).toEqual({
				currentPage: 1,
				totalPages: 0,
				totalCount: 0,
				hasNextPage: false,
				hasPreviousPage: false,
				pageSize: 20,
			});
			expect(typeof result.current.goToPage).toBe("function");
		});

		it("should handle empty search results pagination", async () => {
			const searchMock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%nonexistent%", limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: [] } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchMock]),
			});

			await act(() => {
				result.current.handleSearch("nonexistent");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// ZERO: Empty results should reset pagination
			expect(result.current.pagination.currentPage).toBe(1);
			expect(result.current.pagination.totalPages).toBe(0);
			expect(result.current.pagination.totalCount).toBe(0);
			expect(result.current.pagination.hasNextPage).toBe(false);
			expect(result.current.pagination.hasPreviousPage).toBe(false);
		});
	});

	describe("ONE - Single page navigation", () => {
		it("should handle navigation to a single page", async () => {
			const page1Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: mockPokemon } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([page1Mock]),
			});

			// Initial load
			await act(() => {
				result.current.handleSearch("");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// ONE: Should be on page 1 with proper pagination state
			expect(result.current.pagination.currentPage).toBe(1);
			expect(result.current.pokemon).toHaveLength(3);
			expect(result.current.pokemon[0].name).toBe("bulbasaur");
		});

		it("should handle goToPage function for single page navigation", async () => {
			// Mock for initial load (page 1)
			const initialLoadMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: mockPokemon } as GetPokemonListResponse,
				},
			};

			// Mock for page 2 navigation
			const page2Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 20 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: mockPokemonPage2,
					} as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([initialLoadMock, page2Mock]),
			});

			// Wait for initial load to complete
			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// Navigate to page 2
			await act(() => {
				result.current.goToPage(2);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// ONE: Should navigate to page 2 and replace content
			expect(result.current.pagination.currentPage).toBe(2);
			expect(result.current.pokemon).toHaveLength(3);
			expect(result.current.pokemon[0].name).toBe("charmander");
		});
	});

	describe("MANY - Multiple page navigation", () => {
		it("should handle navigation between multiple pages", async () => {
			const page1Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: mockPokemon } as GetPokemonListResponse,
				},
			};

			const page3Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 40 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{ id: 7, name: "squirtle", height: 5, weight: 90 },
						],
					} as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([page1Mock, page3Mock]),
			});

			// Wait for initial load to complete (hook starts on page 1 by default)
			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.pokemon.length).toBeGreaterThan(0);
			});

			expect(result.current.pagination.currentPage).toBe(1);
			expect(result.current.pokemon[0].name).toBe("bulbasaur");

			// Navigate to page 3
			await act(async () => {
				await result.current.goToPage(3);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// MANY: Should replace content, not append
			expect(result.current.pagination.currentPage).toBe(3);
			expect(result.current.pokemon).toHaveLength(1);
			expect(result.current.pokemon[0].name).toBe("squirtle");
		});

		it("should handle rapid page navigation", async () => {
			const mocks = [
				{
					request: {
						query: GET_POKEMON_LIST,
						variables: { limit: 20, offset: 0 },
					},
					result: {
						data: {
							pokemon_v2_pokemon: [
								{ id: 1, name: "page1", height: 1, weight: 1 },
							],
						},
					},
				},
				{
					request: {
						query: GET_POKEMON_LIST,
						variables: { limit: 20, offset: 20 },
					},
					result: {
						data: {
							pokemon_v2_pokemon: [
								{ id: 2, name: "page2", height: 2, weight: 2 },
							],
						},
					},
				},
				{
					request: {
						query: GET_POKEMON_LIST,
						variables: { limit: 20, offset: 40 },
					},
					result: {
						data: {
							pokemon_v2_pokemon: [
								{ id: 3, name: "page3", height: 3, weight: 3 },
							],
						},
					},
				},
			];

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper(mocks),
			});

			// Rapid navigation: 1 -> 2 -> 3
			await act(async () => {
				await result.current.goToPage(1);
			});

			await act(async () => {
				await result.current.goToPage(2);
			});

			await act(async () => {
				await result.current.goToPage(3);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// MANY: Should end up on final page with correct content
			expect(result.current.pagination.currentPage).toBe(3);
			expect(result.current.pokemon[0].name).toBe("page3");
		});
	});

	describe("BOUNDARY - Edge cases and limits", () => {
		it("should handle navigation to page 1 (boundary)", async () => {
			const page1Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: mockPokemon } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([page1Mock]),
			});

			await act(async () => {
				await result.current.goToPage(1);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// BOUNDARY: Page 1 should have no previous page
			expect(result.current.pagination.currentPage).toBe(1);
			expect(result.current.pagination.hasPreviousPage).toBe(false);
		});

		it("should handle navigation to invalid page numbers", async () => {
			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([]),
			});

			// BOUNDARY: Should handle invalid page numbers gracefully
			await act(() => {
				result.current.goToPage(0); // Invalid: page 0
			});

			await act(() => {
				result.current.goToPage(-1); // Invalid: negative page
			});

			// Should remain on initial page
			expect(result.current.pagination.currentPage).toBe(1);
		});

		it("should calculate pagination boundaries correctly", async () => {
			// Mock data that would result in exactly 2 pages (40 total items, 20 per page)
			const page1Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: Array.from({ length: 20 }, (_, i) => ({
							id: i + 1,
							name: `pokemon${i + 1}`,
							height: 10,
							weight: 100,
						})),
					} as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([page1Mock]),
			});

			await act(() => {
				result.current.goToPage(1);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// BOUNDARY: Should calculate total pages correctly
			// Note: This test will need to be updated once we implement total count tracking
			expect(result.current.pagination.currentPage).toBe(1);
			expect(result.current.pokemon).toHaveLength(20);
		});
	});

	describe("INTERFACE - API contracts and integration", () => {
		it("should maintain stable goToPage function reference", () => {
			const { result, rerender } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([]),
			});

			const firstGoToPage = result.current.goToPage;

			rerender();

			const secondGoToPage = result.current.goToPage;

			// INTERFACE: Function reference should be stable
			expect(firstGoToPage).toBe(secondGoToPage);
		});

		it("should maintain pagination interface consistency", () => {
			const mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 0 },
				},
				result: {
					data: { pokemon_v2_pokemon: mockPokemon } as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([mock]),
			});

			// INTERFACE: Pagination object should always have required properties
			const paginationKeys = Object.keys(result.current.pagination);
			expect(paginationKeys).toContain("currentPage");
			expect(paginationKeys).toContain("totalPages");
			expect(paginationKeys).toContain("totalCount");
			expect(paginationKeys).toContain("hasNextPage");
			expect(paginationKeys).toContain("hasPreviousPage");
			expect(paginationKeys).toContain("pageSize");

			// All pagination values should be numbers or booleans
			expect(typeof result.current.pagination.currentPage).toBe("number");
			expect(typeof result.current.pagination.totalPages).toBe("number");
			expect(typeof result.current.pagination.totalCount).toBe("number");
			expect(typeof result.current.pagination.hasNextPage).toBe("boolean");
			expect(typeof result.current.pagination.hasPreviousPage).toBe("boolean");
			expect(typeof result.current.pagination.pageSize).toBe("number");
		});

		it("should integrate pagination with search functionality", async () => {
			const searchPage1Mock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%pika%", limit: 20, offset: 0 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{ id: 25, name: "pikachu", height: 4, weight: 60 },
						],
					} as GetPokemonListResponse,
				},
			};

			const searchPage2Mock = {
				request: {
					query: SEARCH_POKEMON,
					variables: { name: "%pika%", limit: 20, offset: 20 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{ id: 26, name: "raichu", height: 8, weight: 300 },
						],
					} as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([searchPage1Mock, searchPage2Mock]),
			});

			// Search first
			await act(() => {
				result.current.handleSearch("pika");
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.pokemon[0].name).toBe("pikachu");

			// Then navigate to page 2 of search results
			await act(() => {
				result.current.goToPage(2);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// INTERFACE: Should maintain search context while paginating
			expect(result.current.searchQuery).toBe("pika");
			expect(result.current.pagination.currentPage).toBe(2);
			expect(result.current.pokemon[0].name).toBe("raichu");
		});
	});

	describe("EXERCISE - Error conditions and edge cases", () => {
		it("should handle pagination errors gracefully", async () => {
			const errorMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 20 },
				},
				error: new Error("Network error during pagination"),
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([errorMock]),
			});

			await act(() => {
				result.current.goToPage(2);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should handle errors and set error state
			expect(result.current.error).toBeTruthy();
			expect(result.current.error).toContain("Failed to fetch Pokemon");
		});

		it("should handle concurrent pagination requests", async () => {
			const page2Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 20 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: mockPokemonPage2,
					} as GetPokemonListResponse,
				},
				delay: 100, // Simulate slow request
			};

			const page3Mock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 40 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{ id: 7, name: "squirtle", height: 5, weight: 90 },
						],
					} as GetPokemonListResponse,
				},
				delay: 50, // Faster request
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([page2Mock, page3Mock]),
			});

			// Start both requests quickly
			await act(() => {
				result.current.goToPage(2);
				result.current.goToPage(3); // This should cancel/override the first request
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should end up with the last requested page
			expect(result.current.pagination.currentPage).toBe(3);
			expect(result.current.pokemon[0].name).toBe("squirtle");
		});

		it("should recover from pagination errors on subsequent requests", async () => {
			const errorMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 20 },
				},
				error: new Error("Temporary network error"),
			};

			const successMock = {
				request: {
					query: GET_POKEMON_LIST,
					variables: { limit: 20, offset: 40 },
				},
				result: {
					data: {
						pokemon_v2_pokemon: [
							{ id: 7, name: "squirtle", height: 5, weight: 90 },
						],
					} as GetPokemonListResponse,
				},
			};

			const { result } = renderHook(() => usePokemonSearch(), {
				wrapper: createWrapper([errorMock, successMock]),
			});

			// First request fails
			await act(() => {
				result.current.goToPage(2);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBeTruthy();

			// Second request succeeds
			await act(() => {
				result.current.goToPage(3);
			});

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// EXERCISE: Should recover from error and work normally
			expect(result.current.error).toBe(null);
			expect(result.current.pagination.currentPage).toBe(3);
			expect(result.current.pokemon[0].name).toBe("squirtle");
		});
	});
});
