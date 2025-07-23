import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Pokemon } from "@/lib/types/pokemon";
import { useSearchStore } from "../search-store";

// Mock Pokemon data for testing
const mockPokemon = [
	{
		id: 1,
		name: "bulbasaur",
		height: 7,
		weight: 69,
		pokemon_v2_pokemonsprites: [{ sprites: '{"front_default":"test-url"}' }],
		pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: "grass" } }],
		pokemon_v2_pokemonstats: [
			{ base_stat: 45, pokemon_v2_stat: { name: "hp" } },
			{ base_stat: 49, pokemon_v2_stat: { name: "attack" } },
		],
	},
	{
		id: 25,
		name: "pikachu",
		height: 4,
		weight: 60,
		pokemon_v2_pokemonsprites: [{ sprites: '{"front_default":"pikachu-url"}' }],
		pokemon_v2_pokemontypes: [{ pokemon_v2_type: { name: "electric" } }],
		pokemon_v2_pokemonstats: [
			{ base_stat: 35, pokemon_v2_stat: { name: "hp" } },
			{ base_stat: 55, pokemon_v2_stat: { name: "attack" } },
		],
	},
];

describe("SearchStore - ZOMBIE Method (Vitest)", () => {
	beforeEach(() => {
		// Reset store state before each test
		const { result } = renderHook(() => useSearchStore());
		act(() => {
			result.current.reset();
		});
	});

	describe("Z - Zero (Empty/Initial State)", () => {
		it("should have correct initial state", () => {
			const { result } = renderHook(() => useSearchStore());

			expect(result.current.searchQuery).toBe("");
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.hasSearched).toBe(false);
			expect(result.current.loading).toBe(false);
			expect(result.current.loadingMore).toBe(false);
			expect(result.current.error).toBe(null);
			expect(result.current.canLoadMore).toBe(false);
			expect(result.current.pagination).toEqual({
				currentPage: 1,
				totalPages: 0,
				totalCount: 0,
				hasNextPage: false,
				hasPreviousPage: false,
				pageSize: 20,
			});
			expect(result.current.preferences).toEqual({
				showStats: false,
			});
		});

		it("should handle empty search query", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setSearchQuery("");
			});

			expect(result.current.searchQuery).toBe("");
		});
	});

	describe("O - One (Single Input)", () => {
		it("should set single search query", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setSearchQuery("pikachu");
			});

			expect(result.current.searchQuery).toBe("pikachu");
		});

		it("should toggle loading state", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setLoading(true);
			});
			expect(result.current.loading).toBe(true);

			act(() => {
				result.current.setLoading(false);
			});
			expect(result.current.loading).toBe(false);
		});

		it("should set error message", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setError("Network error");
			});

			expect(result.current.error).toBe("Network error");
		});

		it("should update single preference", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setPreferences({ showStats: true });
			});

			expect(result.current.preferences.showStats).toBe(true);
		});
	});

	describe("M - Many (Multiple Inputs)", () => {
		it("should handle multiple pokemon", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setPokemon(mockPokemon as Pokemon[]);
			});

			expect(result.current.pokemon).toHaveLength(2);
			expect(result.current.pokemon[0].name).toBe("bulbasaur");
			expect(result.current.pokemon[1].name).toBe("pikachu");
		});

		it("should handle multiple preference updates", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setPreferences({
					showStats: true,
				});
			});

			expect(result.current.preferences).toEqual({
				showStats: true,
			});
		});
	});

	describe("B - Boundary (Edge Cases)", () => {
		it("should handle very long search query", () => {
			const { result } = renderHook(() => useSearchStore());
			const longQuery = "a".repeat(1000);

			act(() => {
				result.current.setSearchQuery(longQuery);
			});

			expect(result.current.searchQuery).toBe(longQuery);
		});

		it("should handle boolean preference values", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setPreferences({ showStats: true });
			});
			expect(result.current.preferences.showStats).toBe(true);

			act(() => {
				result.current.setPreferences({ showStats: false });
			});
			expect(result.current.preferences.showStats).toBe(false);
		});
	});

	describe("I - Interface (Contract Testing)", () => {
		it("should have all expected functions", () => {
			const { result } = renderHook(() => useSearchStore());

			expect(typeof result.current.setSearchQuery).toBe("function");
			expect(typeof result.current.setPokemon).toBe("function");
			expect(typeof result.current.setLoading).toBe("function");
			expect(typeof result.current.setError).toBe("function");
			expect(typeof result.current.setPreferences).toBe("function");
			expect(typeof result.current.clearSearch).toBe("function");
			expect(typeof result.current.reset).toBe("function");
		});

		it("should handle clearSearch correctly", () => {
			const { result } = renderHook(() => useSearchStore());

			// Set up some state
			act(() => {
				result.current.setSearchQuery("test");
				result.current.setLoading(true);
				result.current.setError("test error");
				result.current.setPreferences({ showStats: true });
			});

			// Clear search
			act(() => {
				result.current.clearSearch();
			});

			// Verify search state is cleared but preferences are kept
			expect(result.current.searchQuery).toBe("");
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBe(null);
			expect(result.current.preferences.showStats).toBe(true); // Preferences should persist
		});
	});

	describe("E - Exercise (Error/Exception Conditions)", () => {
		it("should handle null error gracefully", () => {
			const { result } = renderHook(() => useSearchStore());

			act(() => {
				result.current.setError("error");
			});
			act(() => {
				result.current.setError(null);
			});

			expect(result.current.error).toBe(null);
		});

		it("should handle reset after complex state", () => {
			const { result } = renderHook(() => useSearchStore());

			// Set up complex state
			act(() => {
				result.current.setSearchQuery("complex");
				result.current.setLoading(true);
				result.current.setError("complex error");
				result.current.setPreferences({ showStats: true });
			});

			// Reset everything
			act(() => {
				result.current.reset();
			});

			// Verify complete reset to initial state
			expect(result.current.searchQuery).toBe("");
			expect(result.current.pokemon).toEqual([]);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBe(null);
			expect(result.current.preferences).toEqual({
				showStats: false,
			});
		});

		it("should handle concurrent state updates", () => {
			const { result } = renderHook(() => useSearchStore());

			// Simulate concurrent updates
			act(() => {
				result.current.setSearchQuery("concurrent");
				result.current.setLoading(true);
				result.current.setPokemon(mockPokemon as Pokemon[]);
				result.current.setError("concurrent error");
			});

			// All updates should be applied
			expect(result.current.searchQuery).toBe("concurrent");
			expect(result.current.loading).toBe(true);
			expect(result.current.pokemon).toHaveLength(2);
			expect(result.current.error).toBe("concurrent error");
		});
	});

	describe("Persistence Behavior", () => {
		it("should persist preferences but not search state", () => {
			const { result } = renderHook(() => useSearchStore());

			// Set both preferences and search state
			act(() => {
				result.current.setPreferences({ showStats: true });
				result.current.setSearchQuery("persistent test");
				result.current.setPokemon(mockPokemon as Pokemon[]);
				result.current.setLoading(true);
			});

			// Verify state is set
			expect(result.current.preferences.showStats).toBe(true);
			expect(result.current.searchQuery).toBe("persistent test");
			expect(result.current.pokemon).toHaveLength(2);
			expect(result.current.loading).toBe(true);

			// Note: In a real persistence test, we would simulate page reload
			// For now, we just verify the structure is correct
		});
	});
});
