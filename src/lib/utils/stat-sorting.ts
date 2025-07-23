import type { Pokemon } from "@/lib/types/pokemon";

/**
 * Sort Pokemon by stat values (HP, Attack, etc.)
 * @param pokemon - Array of Pokemon to sort
 * @param statName - Name of the stat to sort by ('hp', 'attack', etc.)
 * @param ascending - Whether to sort in ascending order
 * @returns Sorted array of Pokemon
 */
export function sortPokemonByStats(
	pokemon: Pokemon[],
	statName: string,
	ascending = true
): Pokemon[] {
	if (!pokemon || pokemon.length === 0) {
		return [];
	}

	// Helper function to get stat value
	const getStatValue = (
		pokemonItem: Pokemon,
		targetStatName: string
	): number => {
		return (
			pokemonItem.pokemon_v2_pokemonstats?.find(
				(stat) => stat.pokemon_v2_stat?.name === targetStatName
			)?.base_stat || 0
		);
	};

	return [...pokemon].sort((a, b) => {
		const aValue = getStatValue(a, statName);
		const bValue = getStatValue(b, statName);
		return ascending ? aValue - bValue : bValue - aValue;
	});
}

/**
 * Apply pagination to a sorted Pokemon array
 * @param pokemon - Sorted array of Pokemon
 * @param page - Current page (1-based)
 * @param pageSize - Number of items per page
 * @returns Paginated Pokemon array and pagination info
 */
export function paginatePokemon(
	pokemon: Pokemon[],
	page: number,
	pageSize = 20
) {
	const totalCount = pokemon.length;
	const totalPages = Math.ceil(totalCount / pageSize);
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;

	const paginatedPokemon = pokemon.slice(startIndex, endIndex);

	return {
		pokemon: paginatedPokemon,
		pagination: {
			currentPage: page,
			totalPages,
			totalCount,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1,
		},
	};
}

/**
 * Check if a sort option requires stat-based sorting
 * @param sortBy - Sort option string
 * @returns True if this is a stat-based sort
 */
export function isStatBasedSort(sortBy: string): boolean {
	return sortBy.includes("hp-") || sortBy.includes("attack-");
}

/**
 * Extract stat name and direction from sort option
 * @param sortBy - Sort option string (e.g., 'hp-asc', 'attack-desc')
 * @returns Object with stat name and ascending flag
 */
export function parseStatSort(sortBy: string): {
	statName: string;
	ascending: boolean;
} {
	const statName = sortBy.includes("hp-") ? "hp" : "attack";
	const ascending = sortBy.endsWith("-asc");

	return { statName, ascending };
}
