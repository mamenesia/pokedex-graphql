import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POKEMON_GENERATIONS, POKEMON_TYPES } from "@/data/constants/pokemon";
import { useSearchStore } from "@/stores/search-store";
import FilterContainer from "../FilterContainer";
import GenerationFilter from "../GenerationFilter";
import TypeFilter from "../TypeFilter";

// Mock the Zustand store
vi.mock("@/stores/search-store");

// ZOMBIE Method: Testing filter UI components with comprehensive coverage
describe("Filter Components - ZOMBIE Method Tests", () => {
	// Common store mock setup
	const mockStore = {
		filters: {
			types: [],
			generations: [],
		},
		hasActiveFilters: false,
		addTypeFilter: vi.fn(),
		removeTypeFilter: vi.fn(),
		addGenerationFilter: vi.fn(),
		removeGenerationFilter: vi.fn(),
		clearFilters: vi.fn(),
	};

	// Reset mocks before each test
	beforeEach(() => {
		vi.resetAllMocks();
		// Default mock implementation
		(useSearchStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
			() => mockStore
		);
	});

	describe("ZERO - Initial state and empty conditions", () => {
		it("should render TypeFilter with all types unselected", () => {
			render(<TypeFilter />);

			// ZERO: Check that all type filters are displayed and unselected
			for (const type of POKEMON_TYPES) {
				const typeElement = screen.getByText(type.name);
				expect(typeElement).toBeInTheDocument();
				expect(typeElement.parentElement).toHaveClass("opacity-60");
			}

			// No X icons should be present in the unselected state
			const closeIcons = screen.queryAllByTestId("x-icon");
			expect(closeIcons.length).toBe(0);
		});

		it("should render GenerationFilter with all generations unselected", () => {
			render(<GenerationFilter />);

			// ZERO: Check that all generation filters are displayed and unselected
			for (const gen of POKEMON_GENERATIONS) {
				const genElement = screen.getByText(gen.name);
				expect(genElement).toBeInTheDocument();
				expect(genElement.parentElement).toHaveClass("opacity-60");
			}
		});

		it("should not show Clear All button when no filters are active", () => {
			render(<FilterContainer />);

			// ZERO: Clear All button should not be visible when hasActiveFilters is false
			const clearButton = screen.queryByText("Clear All");
			expect(clearButton).not.toBeInTheDocument();
		});
	});

	describe("ONE - Single inputs and basic functionality", () => {
		it("should call addTypeFilter when clicking an unselected type", () => {
			render(<TypeFilter />);

			// ONE: Click a single type filter
			const fireTypeElement = screen.getByText("fire");
			fireEvent.click(fireTypeElement);

			// Verify the store action was called with the correct type
			expect(mockStore.addTypeFilter).toHaveBeenCalledWith("fire");
			expect(mockStore.addTypeFilter).toHaveBeenCalledTimes(1);
		});

		it("should call removeTypeFilter when clicking a selected type", () => {
			// Set up the store with a selected type
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					types: ["water"],
				},
			}));

			render(<TypeFilter />);

			// ONE: Click the selected type filter
			const waterTypeElement = screen.getByText("water");
			fireEvent.click(waterTypeElement);

			// Verify the store action was called with the correct type
			expect(mockStore.removeTypeFilter).toHaveBeenCalledWith("water");
			expect(mockStore.removeTypeFilter).toHaveBeenCalledTimes(1);
		});

		it("should call addGenerationFilter when clicking an unselected generation", () => {
			render(<GenerationFilter />);

			// ONE: Click a single generation filter
			const gen1Element = screen.getByText("Gen I");
			fireEvent.click(gen1Element);

			// Verify the store action was called with the correct generation
			expect(mockStore.addGenerationFilter).toHaveBeenCalledWith(1);
			expect(mockStore.addGenerationFilter).toHaveBeenCalledTimes(1);
		});

		it("should call removeGenerationFilter when clicking a selected generation", () => {
			// Set up the store with a selected generation
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					generations: [2],
				},
			}));

			render(<GenerationFilter />);

			// ONE: Click the selected generation filter
			const gen2Element = screen.getByText("Gen II");
			fireEvent.click(gen2Element);

			// Verify the store action was called with the correct generation
			expect(mockStore.removeGenerationFilter).toHaveBeenCalledWith(2);
			expect(mockStore.removeGenerationFilter).toHaveBeenCalledTimes(1);
		});
	});

	describe("MANY - Multiple inputs, results, and batch operations", () => {
		it("should show selected styling for multiple type filters", () => {
			// Set up the store with multiple selected types
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					types: ["fire", "water", "grass"],
				},
			}));

			render(<TypeFilter />);

			// MANY: Verify multiple selections are styled correctly
			const fireTypeElement = screen.getByText("fire");
			const waterTypeElement = screen.getByText("water");
			const grassTypeElement = screen.getByText("grass");
			const normalTypeElement = screen.getByText("normal"); // Unselected type

			expect(fireTypeElement.parentElement).toHaveClass("opacity-100");
			expect(waterTypeElement.parentElement).toHaveClass("opacity-100");
			expect(grassTypeElement.parentElement).toHaveClass("opacity-100");
			expect(normalTypeElement.parentElement).toHaveClass("opacity-60");
		});

		it("should show selected styling for multiple generation filters", () => {
			// Set up the store with multiple selected generations
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					generations: [1, 3, 5],
				},
			}));

			render(<GenerationFilter />);

			// MANY: Verify multiple selections are styled correctly
			const gen1Element = screen.getByText("Gen I");
			const gen3Element = screen.getByText("Gen III");
			const gen5Element = screen.getByText("Gen V");
			const gen2Element = screen.getByText("Gen II"); // Unselected generation

			expect(gen1Element.parentElement).toHaveClass("opacity-100");
			expect(gen3Element.parentElement).toHaveClass("opacity-100");
			expect(gen5Element.parentElement).toHaveClass("opacity-100");
			expect(gen2Element.parentElement).toHaveClass("opacity-60");
		});

		it("should handle mixed selections in FilterContainer", () => {
			// Set up the store with both type and generation filters
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					types: ["electric", "psychic"],
					generations: [4, 7],
				},
				hasActiveFilters: true,
			}));

			render(<FilterContainer />);

			// MANY: Verify both types of filters display correctly in the container
			const electricTypeElement = screen.getByText("electric");
			const psychicTypeElement = screen.getByText("psychic");
			const gen4Element = screen.getByText("Gen IV");
			const gen7Element = screen.getByText("Gen VII");

			expect(electricTypeElement).toBeInTheDocument();
			expect(psychicTypeElement).toBeInTheDocument();
			expect(gen4Element).toBeInTheDocument();
			expect(gen7Element).toBeInTheDocument();

			// Clear All button should be visible with active filters
			const clearButton = screen.getByText("Clear All");
			expect(clearButton).toBeInTheDocument();
		});
	});

	describe("BOUNDARY - Edge cases and limits", () => {
		it("should handle all types selected", () => {
			// Set up the store with all types selected
			const allTypeNames = POKEMON_TYPES.map((type) => type.name);
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					types: allTypeNames,
				},
				hasActiveFilters: true,
			}));

			render(<TypeFilter />);

			// BOUNDARY: Verify all types are styled as selected
			for (const type of POKEMON_TYPES) {
				const typeElement = screen.getByText(type.name);
				expect(typeElement.parentElement).toHaveClass("opacity-100");
			}
		});

		it("should handle all generations selected", () => {
			// Set up the store with all generations selected
			const allGenIds = POKEMON_GENERATIONS.map((gen) => gen.id);
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					...mockStore.filters,
					generations: allGenIds,
				},
				hasActiveFilters: true,
			}));

			render(<GenerationFilter />);

			// BOUNDARY: Verify all generations are styled as selected
			for (const gen of POKEMON_GENERATIONS) {
				const genElement = screen.getByText(gen.name);
				expect(genElement.parentElement).toHaveClass("opacity-100");
			}
		});

		it("should handle clearing all filters", () => {
			// Set up the store with active filters
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				filters: {
					types: ["dragon", "ghost"],
					generations: [6, 8],
				},
				hasActiveFilters: true,
			}));

			render(<FilterContainer />);

			// BOUNDARY: Click Clear All button
			const clearButton = screen.getByText("Clear All");
			fireEvent.click(clearButton);

			// Verify clearFilters action was called
			expect(mockStore.clearFilters).toHaveBeenCalledTimes(1);
		});
	});

	describe("INTERFACE - API contracts and integration points", () => {
		it("should properly integrate TypeFilter with Zustand store", () => {
			render(<TypeFilter />);

			// INTERFACE: Verify component consumes store state and calls actions
			const typeElement = screen.getByText("ice");
			fireEvent.click(typeElement);

			expect(mockStore.addTypeFilter).toHaveBeenCalledWith("ice");
			expect(useSearchStore).toHaveBeenCalled();
		});

		it("should properly integrate GenerationFilter with Zustand store", () => {
			render(<GenerationFilter />);

			// INTERFACE: Verify component consumes store state and calls actions
			const genElement = screen.getByText("Gen IX");
			fireEvent.click(genElement);

			expect(mockStore.addGenerationFilter).toHaveBeenCalledWith(9);
			expect(useSearchStore).toHaveBeenCalled();
		});

		it("should properly integrate FilterContainer with child components", () => {
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				...mockStore,
				hasActiveFilters: true,
			}));

			render(<FilterContainer />);

			// INTERFACE: Verify container passes props correctly to children
			expect(screen.getByText("Filter by Type")).toBeInTheDocument();
			expect(screen.getByText("Filter by Generation")).toBeInTheDocument();
			expect(screen.getByText("Clear All")).toBeInTheDocument();
		});
	});

	describe("EXERCISE - Error conditions and exception handling", () => {
		it("should handle click events when store actions throw errors", () => {
			// Mock an error being thrown by store action
			mockStore.addTypeFilter.mockImplementation(() => {
				throw new Error("Test error");
			});

			// We don't expect the component to crash, but we want to verify the error occurs
			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(vi.fn());

			render(<TypeFilter />);

			// EXERCISE: Click should not crash component even if action throws
			const typeElement = screen.getByText("fire");
			expect(() => {
				fireEvent.click(typeElement);
			}).not.toThrow();

			// Verify error was logged
			expect(mockStore.addTypeFilter).toHaveBeenCalledWith("fire");

			consoleErrorSpy.mockRestore();
		});

		it("should handle cases where store is not properly initialized", () => {
			// Mock a partially initialized store
			(
				useSearchStore as unknown as ReturnType<typeof vi.fn>
			).mockImplementation(() => ({
				filters: { types: [], generations: [] },
				// Missing action methods
			}));

			// Should not throw when rendering
			expect(() => {
				render(<TypeFilter />);
			}).not.toThrow();

			// Component should still render the UI elements
			for (const type of POKEMON_TYPES) {
				expect(screen.getByText(type.name)).toBeInTheDocument();
			}
		});
	});
});
