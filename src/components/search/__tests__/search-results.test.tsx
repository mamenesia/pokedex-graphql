/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/performance/useTopLevelRegex: <explanation> */
/** biome-ignore-all lint/style/useImportType: <explanation> */

import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginationInfo, Pokemon } from "@/lib/types/pokemon";
import { useSearchStore } from "@/stores/search-store";
import { SearchResults } from "../search-results";

// Mock the search store
vi.mock("@/stores/search-store", () => ({
	useSearchStore: vi.fn(),
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
	default: (props: { src: string; alt: string; [key: string]: unknown }) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={props.alt} src={props.src} />
	),
}));

// Mock PokemonGrid component
vi.mock("@/components/pokemon/pokemon-grid", () => ({
	PokemonGrid: ({
		pokemon,
		onPokemonClick,
		showStats,
	}: {
		pokemon: Pokemon[];
		onPokemonClick?: (p: Pokemon) => void;
		showStats: boolean;
	}) => (
		<div data-testid="pokemon-grid">
			<div data-testid="show-stats">{showStats ? "stats-on" : "stats-off"}</div>
			{pokemon.map((p: Pokemon) => (
				<button
					data-testid={`pokemon-${p.id}`}
					key={p.id}
					onClick={() => onPokemonClick?.(p)}
					type="button"
				>
					{p.name}
				</button>
			))}
		</div>
	),
}));

// Mock Button component
vi.mock("@/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		...props
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<button onClick={onClick} {...props} type="button">
			{children}
		</button>
	),
}));

describe("SearchResults Component - ZOMBIE Method Tests", () => {
	const mockPokemon: Pokemon[] = [
		{
			id: 1,
			name: "bulbasaur",
			height: 7,
			weight: 69,
			pokemon_v2_pokemonsprites: [
				{ sprites: '{"front_default":"bulbasaur.png"}' },
			],
			pokemon_v2_pokemontypes: [{ pokemon_v2_type: { id: 12, name: "grass" } }],
			pokemon_v2_pokemonstats: [
				{ base_stat: 45, pokemon_v2_stat: { name: "hp" } },
			],
		},
		{
			id: 2,
			name: "ivysaur",
			height: 10,
			weight: 130,
			pokemon_v2_pokemonsprites: [
				{ sprites: '{"front_default":"ivysaur.png"}' },
			],
			pokemon_v2_pokemontypes: [{ pokemon_v2_type: { id: 12, name: "grass" } }],
			pokemon_v2_pokemonstats: [
				{ base_stat: 60, pokemon_v2_stat: { name: "hp" } },
			],
		},
	];

	const mockPagination: PaginationInfo = {
		currentPage: 1,
		totalPages: 10,
		totalCount: 100,
		hasNextPage: true,
		hasPreviousPage: false,
		pageSize: 10,
	};

	const defaultStoreState = {
		pokemon: [],
		loading: false,
		loadingMore: false,
		error: null,
		searchQuery: "",
		hasSearched: false,
		pagination: {
			currentPage: 1,
			totalPages: 0,
			totalCount: 0,
			hasNextPage: false,
			hasPreviousPage: false,
			pageSize: 10,
		},
		canLoadMore: false,
		preferences: { showStats: false },
	};

	const mockCallbacks = {
		onPokemonClick: vi.fn(),
		onClearSearch: vi.fn(),
		onLoadMore: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	// ===== ZERO - Initial/Empty States =====
	describe("ZERO - Initial/Empty States", () => {
		it("should render loading state when loading is true", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				loading: true,
				searchQuery: "pikachu",
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(
				screen.getByText('Searching for "pikachu"...')
			).toBeInTheDocument();
			expect(screen.getByAltText("Pokeball")).toBeInTheDocument();
		});

		it("should render loading state without search query", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				loading: true,
				searchQuery: "",
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("Loading Pokemon...")).toBeInTheDocument();
		});

		it("should render error state when error exists", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				error: "Network error occurred",
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("Search Error")).toBeInTheDocument();
			expect(screen.getByText("Network error occurred")).toBeInTheDocument();
		});

		it("should render empty search results when no pokemon found", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				hasSearched: true,
				searchQuery: "nonexistent",
				pokemon: [],
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("No Pokemon Found")).toBeInTheDocument();
			expect(
				screen.getByText(
					'No Pokemon found matching "nonexistent". Try a different search term.'
				)
			).toBeInTheDocument();
		});
	});

	// ===== ONE - Single Items =====
	describe("ONE - Single Items", () => {
		it("should render single pokemon in default list", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: [mockPokemon[0]],
				hasSearched: false,
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("All Pokemon")).toBeInTheDocument();
			expect(screen.getByText("Showing 1 Pokemon")).toBeInTheDocument();
			expect(screen.getByTestId("pokemon-1")).toBeInTheDocument();
			expect(screen.getByText("bulbasaur")).toBeInTheDocument();
		});

		it("should render single pokemon in search results", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: [mockPokemon[0]],
				hasSearched: true,
				searchQuery: "bulbasaur",
				pagination: { ...mockPagination, totalCount: 1 },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(
				screen.getByText('Search Results for "bulbasaur"')
			).toBeInTheDocument();
			expect(screen.getByText(/Showing 1 of \d+ Pokemon/)).toBeInTheDocument();
			expect(screen.getByTestId("pokemon-1")).toBeInTheDocument();
		});

		it("should handle single pokemon click", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: [mockPokemon[0]],
			});

			render(<SearchResults {...mockCallbacks} />);

			fireEvent.click(screen.getByTestId("pokemon-1"));
			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledWith(mockPokemon[0]);
			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledTimes(1);
		});
	});

	// ===== MANY - Multiple Items =====
	describe("MANY - Multiple Items", () => {
		it("should render multiple pokemon in grid", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "grass",
				pagination: { ...mockPagination, totalCount: 2 },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(
				screen.getByText(/Showing \d+ of \d+ Pokemon/)
			).toBeInTheDocument();
			expect(screen.getByTestId("pokemon-1")).toBeInTheDocument();
			expect(screen.getByTestId("pokemon-2")).toBeInTheDocument();
			expect(screen.getByText("bulbasaur")).toBeInTheDocument();
			expect(screen.getByText("ivysaur")).toBeInTheDocument();
		});

		it("should handle multiple pokemon clicks", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
			});

			render(<SearchResults {...mockCallbacks} />);

			fireEvent.click(screen.getByTestId("pokemon-1"));
			fireEvent.click(screen.getByTestId("pokemon-2"));

			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledWith(mockPokemon[0]);
			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledWith(mockPokemon[1]);
			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledTimes(2);
		});

		it("should render load more section when can load more", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "grass",
				canLoadMore: true,
				pagination: { ...mockPagination, totalCount: 50 },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("Load More")).toBeInTheDocument();
			expect(screen.getByText("Showing 2 of 50 Pokemon")).toBeInTheDocument();
		});
	});

	// ===== BOUNDARY - Edge Cases =====
	describe("BOUNDARY - Edge Cases", () => {
		it("should handle empty search query with results", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "",
			});

			render(<SearchResults {...mockCallbacks} />);

			// Should not show search header for empty query
			expect(
				screen.queryByText('Search Results for ""')
			).not.toBeInTheDocument();
			expect(screen.getByTestId("pokemon-grid")).toBeInTheDocument();
		});

		it("should handle very long search query", () => {
			const longQuery = "a".repeat(100);
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				hasSearched: true,
				searchQuery: longQuery,
				pokemon: [],
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("No Pokemon Found")).toBeInTheDocument();
			expect(
				screen.getByText(
					`No Pokemon found matching "${longQuery}". Try a different search term.`
				)
			).toBeInTheDocument();
		});

		it("should handle zero total count with pagination", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: [],
				hasSearched: true,
				searchQuery: "test",
				pagination: { totalCount: 0, hasNextPage: false, endCursor: null },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("No Pokemon Found")).toBeInTheDocument();
			expect(
				screen.getByText(
					'No Pokemon found matching "test". Try a different search term.'
				)
			).toBeInTheDocument();
		});

		it("should handle load more when loading more", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "test",
				canLoadMore: true,
				loadingMore: true,
				pagination: { ...mockPagination, totalCount: 50 },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByText("Loading...")).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /Loading/ })).toBeDisabled();
		});
	});

	// ===== INTERFACE - Component API =====
	describe("INTERFACE - Component API", () => {
		it("should call onClearSearch when clear button is clicked", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				error: "Some error",
			});

			render(<SearchResults {...mockCallbacks} />);

			const clearButton = screen.getByText("Try Again");
			fireEvent.click(clearButton);

			expect(mockCallbacks.onClearSearch).toHaveBeenCalledTimes(1);
		});

		it("should call onLoadMore when load more button is clicked", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "test",
				canLoadMore: true,
				pagination: { ...mockPagination, totalCount: 50 },
			});

			render(<SearchResults {...mockCallbacks} />);

			const loadMoreButton = screen.getByText("Load More");
			fireEvent.click(loadMoreButton);

			expect(mockCallbacks.onLoadMore).toHaveBeenCalledTimes(1);
		});

		it("should pass showStats preference to PokemonGrid", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				preferences: { showStats: true },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByTestId("show-stats")).toHaveTextContent("stats-on");
		});

		it("should pass showStats false to PokemonGrid", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				preferences: { showStats: false },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(screen.getByTestId("show-stats")).toHaveTextContent("stats-off");
		});
	});

	// ===== EXERCISE - Complex Scenarios =====
	describe("EXERCISE - Complex Scenarios", () => {
		it("should render end of results message when cannot load more", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "grass",
				canLoadMore: false,
				pagination: { ...mockPagination, totalCount: 2, hasNextPage: false },
			});

			render(<SearchResults {...mockCallbacks} />);

			expect(
				screen.getByText('🎉 You\'ve seen all 2 results for "grass"')
			).toBeInTheDocument();
		});

		it("should handle state transitions from loading to success", () => {
			const { rerender } = render(<SearchResults {...mockCallbacks} />);

			// Initial loading state
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				loading: true,
				searchQuery: "pikachu",
			});
			rerender(<SearchResults {...mockCallbacks} />);
			expect(
				screen.getByText('Searching for "pikachu"...')
			).toBeInTheDocument();

			// Success state
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: [mockPokemon[0]],
				hasSearched: true,
				searchQuery: "pikachu",
				pagination: { ...mockPagination, totalCount: 1 },
			});
			rerender(<SearchResults {...mockCallbacks} />);
			expect(
				screen.getByText('Search Results for "pikachu"')
			).toBeInTheDocument();
			expect(screen.getByTestId("pokemon-1")).toBeInTheDocument();
		});

		it("should handle state transitions from loading to error", () => {
			const { rerender } = render(<SearchResults {...mockCallbacks} />);

			// Initial loading state
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				loading: true,
			});
			rerender(<SearchResults {...mockCallbacks} />);
			expect(screen.getByText("Loading Pokemon...")).toBeInTheDocument();

			// Error state
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				error: "Failed to fetch",
			});
			rerender(<SearchResults {...mockCallbacks} />);
			expect(screen.getByText("Search Error")).toBeInTheDocument();
			expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
		});

		it("should handle complex search scenario with pagination", () => {
			(useSearchStore as any).mockReturnValue({
				...defaultStoreState,
				pokemon: mockPokemon,
				hasSearched: true,
				searchQuery: "grass type",
				canLoadMore: true,
				loadingMore: false,
				pagination: { ...mockPagination, totalCount: 25 },
				preferences: { showStats: true },
			});

			render(<SearchResults {...mockCallbacks} />);

			// Verify all elements are present
			expect(
				screen.getByText('Search Results for "grass type"')
			).toBeInTheDocument();
			// Component shows "Showing X of Y Pokemon" format, tested below
			expect(screen.getByTestId("show-stats")).toHaveTextContent("stats-on");
			expect(screen.getByText("Load More")).toBeInTheDocument();
			expect(screen.getByText("Showing 2 of 25 Pokemon")).toBeInTheDocument();

			// Test interactions
			fireEvent.click(screen.getByTestId("pokemon-1"));
			fireEvent.click(screen.getByText("Load More"));

			expect(mockCallbacks.onPokemonClick).toHaveBeenCalledWith(mockPokemon[0]);
			expect(mockCallbacks.onLoadMore).toHaveBeenCalledTimes(1);
		});
	});
});
