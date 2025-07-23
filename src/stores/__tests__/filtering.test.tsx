import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
	type PokemonFilters,
	type SortOption,
	useSearchStore,
} from "../search-store";

// ZOMBIE Method: Testing filtering functionality with comprehensive coverage
describe("Filtering System - ZOMBIE Method Tests", () => {
	// Reset Zustand store before each test to ensure clean initial state
	beforeEach(() => {
		const { reset } = useSearchStore.getState();
		reset();
	});

	describe("ZERO - Initial state and empty conditions", () => {
		it("should return initial filter state with zero/empty values", () => {
			const { result } = renderHook(() => useSearchStore());

			// ZERO: Test initial filter state
			expect(result.current.filters.types).toEqual([]);
			expect(result.current.filters.generations).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);
			expect(result.current.sort.sortBy).toBe("id-asc");

			// ZERO: Test filter actions exist
			expect(typeof result.current.setFilters).toBe("function");
			expect(typeof result.current.addTypeFilter).toBe("function");
			expect(typeof result.current.removeTypeFilter).toBe("function");
			expect(typeof result.current.addGenerationFilter).toBe("function");
			expect(typeof result.current.removeGenerationFilter).toBe("function");
			expect(typeof result.current.clearFilters).toBe("function");
			expect(typeof result.current.setSortBy).toBe("function");
		});

		it("should handle empty filter operations gracefully", () => {
			const { result } = renderHook(() => useSearchStore());

			// ZERO: Removing from empty filters should not cause errors
			act(() => {
				result.current.removeTypeFilter("fire");
			});
			expect(result.current.filters.types).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);

			act(() => {
				result.current.removeGenerationFilter(1);
			});
			expect(result.current.filters.generations).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);
		});
	});

	describe("ONE - Single inputs and basic functionality", () => {
		it("should handle adding a single type filter", () => {
			const { result } = renderHook(() => useSearchStore());

			// ONE: Add single type filter
			act(() => {
				result.current.addTypeFilter("fire");
			});

			expect(result.current.filters.types).toEqual(["fire"]);
			expect(result.current.filters.generations).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle adding a single generation filter", () => {
			const { result } = renderHook(() => useSearchStore());

			// ONE: Add single generation filter
			act(() => {
				result.current.addGenerationFilter(1);
			});

			expect(result.current.filters.types).toEqual([]);
			expect(result.current.filters.generations).toEqual([1]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle removing a single type filter", () => {
			const { result } = renderHook(() => useSearchStore());

			// ONE: Add then remove single type filter
			act(() => {
				result.current.addTypeFilter("water");
			});
			expect(result.current.hasActiveFilters).toBe(true);

			act(() => {
				result.current.removeTypeFilter("water");
			});
			expect(result.current.filters.types).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);
		});

		it("should handle setting a single sort option", () => {
			const { result } = renderHook(() => useSearchStore());

			// ONE: Set single sort option
			act(() => {
				result.current.setSortBy("name-asc");
			});

			expect(result.current.sort.sortBy).toBe("name-asc");
		});

		it("should handle setting filters with setFilters action", () => {
			const { result } = renderHook(() => useSearchStore());

			// ONE: Set filters using setFilters action
			const newFilters: Partial<PokemonFilters> = {
				types: ["grass"],
			};

			act(() => {
				result.current.setFilters(newFilters);
			});

			expect(result.current.filters.types).toEqual(["grass"]);
			expect(result.current.hasActiveFilters).toBe(true);
		});
	});

	describe("MANY - Multiple inputs, results, and batch operations", () => {
		it("should handle multiple type filters", () => {
			const { result } = renderHook(() => useSearchStore());

			// MANY: Add multiple type filters
			act(() => {
				result.current.addTypeFilter("fire");
				result.current.addTypeFilter("water");
				result.current.addTypeFilter("grass");
			});

			expect(result.current.filters.types).toEqual(["fire", "water", "grass"]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle multiple generation filters", () => {
			const { result } = renderHook(() => useSearchStore());

			// MANY: Add multiple generation filters
			act(() => {
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(2);
				result.current.addGenerationFilter(3);
			});

			expect(result.current.filters.generations).toEqual([1, 2, 3]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle mixed type and generation filters", () => {
			const { result } = renderHook(() => useSearchStore());

			// MANY: Add mixed filters
			act(() => {
				result.current.addTypeFilter("electric");
				result.current.addTypeFilter("psychic");
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(4);
			});

			expect(result.current.filters.types).toEqual(["electric", "psychic"]);
			expect(result.current.filters.generations).toEqual([1, 4]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle batch filter operations with setFilters", () => {
			const { result } = renderHook(() => useSearchStore());

			// MANY: Set multiple filters at once
			const batchFilters: Partial<PokemonFilters> = {
				types: ["dragon", "flying", "steel"],
				generations: [2, 3, 5],
			};

			act(() => {
				result.current.setFilters(batchFilters);
			});

			expect(result.current.filters.types).toEqual([
				"dragon",
				"flying",
				"steel",
			]);
			expect(result.current.filters.generations).toEqual([2, 3, 5]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle removing multiple filters", () => {
			const { result } = renderHook(() => useSearchStore());

			// MANY: Add multiple filters then remove some
			act(() => {
				result.current.addTypeFilter("fire");
				result.current.addTypeFilter("water");
				result.current.addTypeFilter("grass");
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(2);
			});

			expect(result.current.hasActiveFilters).toBe(true);

			act(() => {
				result.current.removeTypeFilter("water");
				result.current.removeGenerationFilter(1);
			});

			expect(result.current.filters.types).toEqual(["fire", "grass"]);
			expect(result.current.filters.generations).toEqual([2]);
			expect(result.current.hasActiveFilters).toBe(true);
		});
	});

	describe("BOUNDARY - Edge cases and limits", () => {
		it("should handle duplicate type filter additions", () => {
			const { result } = renderHook(() => useSearchStore());

			// BOUNDARY: Adding duplicate type filters should not create duplicates
			act(() => {
				result.current.addTypeFilter("fire");
				result.current.addTypeFilter("fire");
				result.current.addTypeFilter("fire");
			});

			expect(result.current.filters.types).toEqual(["fire"]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle duplicate generation filter additions", () => {
			const { result } = renderHook(() => useSearchStore());

			// BOUNDARY: Adding duplicate generation filters should not create duplicates
			act(() => {
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(1);
			});

			expect(result.current.filters.generations).toEqual([1]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle removing non-existent filters", () => {
			const { result } = renderHook(() => useSearchStore());

			// BOUNDARY: Removing non-existent filters should not cause errors
			act(() => {
				result.current.addTypeFilter("fire");
				result.current.removeTypeFilter("water"); // Not in the list
				result.current.removeTypeFilter("nonexistent");
			});

			expect(result.current.filters.types).toEqual(["fire"]);
			expect(result.current.hasActiveFilters).toBe(true);
		});

		it("should handle clearing all filters when filters exist", () => {
			const { result } = renderHook(() => useSearchStore());

			// BOUNDARY: Clear filters when many exist
			act(() => {
				result.current.addTypeFilter("fire");
				result.current.addTypeFilter("water");
				result.current.addGenerationFilter(1);
				result.current.addGenerationFilter(2);
			});

			expect(result.current.hasActiveFilters).toBe(true);

			act(() => {
				result.current.clearFilters();
			});

			expect(result.current.filters.types).toEqual([]);
			expect(result.current.filters.generations).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);
		});

		it("should handle clearing filters when no filters exist", () => {
			const { result } = renderHook(() => useSearchStore());

			// BOUNDARY: Clear filters when none exist
			act(() => {
				result.current.clearFilters();
			});

			expect(result.current.filters.types).toEqual([]);
			expect(result.current.filters.generations).toEqual([]);
			expect(result.current.hasActiveFilters).toBe(false);
		});

		it("should handle all available sort options", () => {
			const { result } = renderHook(() => useSearchStore());

			const sortOptions: SortOption[] = [
				"name-asc",
				"name-desc",
				"id-asc",
				"id-desc",
				"hp-asc",
				"hp-desc",
				"attack-asc",
				"attack-desc",
			];

			// BOUNDARY: Test all sort options
			for (const sortOption of sortOptions) {
				act(() => {
					result.current.setSortBy(sortOption);
				});
				expect(result.current.sort.sortBy).toBe(sortOption);
			}
		});
	});
});
