import type { SortOption } from "@/stores/search-store";

// GraphQL order_by type for Pokemon queries
export interface PokemonOrderBy {
	id?: "asc" | "desc";
	name?: "asc" | "desc";
	pokemon_v2_pokemonstats_aggregate?: {
		max?: {
			base_stat?: "asc" | "desc";
		};
	};
}

// Convert our SortOption to GraphQL order_by parameter
export function getSortOrderBy(sortBy: SortOption): PokemonOrderBy[] {
	switch (sortBy) {
		case "name-asc":
			return [{ name: "asc" }];
		case "name-desc":
			return [{ name: "desc" }];
		case "id-asc":
			return [{ id: "asc" }];
		case "id-desc":
			return [{ id: "desc" }];
		case "hp-asc":
		case "hp-desc":
		case "attack-asc":
		case "attack-desc":
			// For stat-based sorting, we need to use a different approach
			// Since GraphQL aggregate sorting by specific stat_id is complex,
			// we'll fall back to ID sorting and handle stat sorting client-side
			// TODO: Implement proper stat-specific GraphQL sorting
			return [{ id: "asc" }];
		default:
			// Default to ID ascending
			return [{ id: "asc" }];
	}
}

// Get a human-readable description of the sort option
export function getSortDescription(sortBy: SortOption): string {
	switch (sortBy) {
		case "name-asc":
			return "Name (A-Z)";
		case "name-desc":
			return "Name (Z-A)";
		case "id-asc":
			return "Pokédex Number (Low to High)";
		case "id-desc":
			return "Pokédex Number (High to Low)";
		case "hp-asc":
			return "HP (Low to High)";
		case "hp-desc":
			return "HP (High to Low)";
		case "attack-asc":
			return "Attack (Low to High)";
		case "attack-desc":
			return "Attack (High to Low)";
		default:
			return "Default";
	}
}
