import type { Pokemon } from "@/lib/types/pokemon";
import type { SortOption } from "@/stores/search-store";

/**
 * Sort Pokemon array based on the specified sort option
 */
export function sortPokemon(pokemon: Pokemon[], sortBy: SortOption): Pokemon[] {
	const sortedPokemon = [...pokemon]; // Create a copy to avoid mutation

	switch (sortBy) {
		case "name-asc":
			return sortedPokemon.sort((a, b) => a.name.localeCompare(b.name));

		case "name-desc":
			return sortedPokemon.sort((a, b) => b.name.localeCompare(a.name));

		case "id-asc":
			return sortedPokemon.sort((a, b) => a.id - b.id);

		case "id-desc":
			return sortedPokemon.sort((a, b) => b.id - a.id);

		case "hp-asc":
			return sortedPokemon.sort((a, b) => {
				const hpA = getStatValue(a, "hp");
				const hpB = getStatValue(b, "hp");
				return hpA - hpB;
			});

		case "hp-desc":
			return sortedPokemon.sort((a, b) => {
				const hpA = getStatValue(a, "hp");
				const hpB = getStatValue(b, "hp");
				return hpB - hpA;
			});

		case "attack-asc":
			return sortedPokemon.sort((a, b) => {
				const attackA = getStatValue(a, "attack");
				const attackB = getStatValue(b, "attack");
				return attackA - attackB;
			});

		case "attack-desc":
			return sortedPokemon.sort((a, b) => {
				const attackA = getStatValue(a, "attack");
				const attackB = getStatValue(b, "attack");
				return attackB - attackA;
			});

		default:
			// Default to name ascending
			return sortedPokemon.sort((a, b) => a.name.localeCompare(b.name));
	}
}

/**
 * Get stat value from Pokemon data
 */
function getStatValue(pokemon: Pokemon, statName: string): number {
	// Debug: Log available stat names for the first few Pokemon
	if (pokemon.id <= 3) {
		console.log(
			`🔍 Pokemon ${pokemon.name} stats:`,
			pokemon.pokemon_v2_pokemonstats?.map(
				(s) => `${s.pokemon_v2_stat.name}: ${s.base_stat}`
			) || []
		);
	}

	// Map our stat names to the actual database stat names
	const statNameMap: Record<string, string> = {
		hp: "hp",
		attack: "attack",
		// Also try common variations
		HP: "hp",
		Attack: "attack",
	};

	const actualStatName = statNameMap[statName] || statName;

	const stat = pokemon.pokemon_v2_pokemonstats?.find(
		(s) => s.pokemon_v2_stat.name === actualStatName
	);

	if (!stat && pokemon.id <= 3) {
		console.log(
			`⚠️ Stat "${statName}" (looking for "${actualStatName}") not found for ${pokemon.name}`
		);
		console.log(
			"Available stats:",
			pokemon.pokemon_v2_pokemonstats?.map((s) => s.pokemon_v2_stat.name)
		);
	}

	return stat?.base_stat || 0;
}

/**
 * Get sort option display name
 */
export function getSortDisplayName(sortBy: SortOption): string {
	const sortOptions: Record<SortOption, string> = {
		"name-asc": "Name (A-Z)",
		"name-desc": "Name (Z-A)",
		"id-asc": "Pokedex Number (Low to High)",
		"id-desc": "Pokedex Number (High to Low)",
		"hp-asc": "HP (Lowest First)",
		"hp-desc": "HP (Highest First)",
		"attack-asc": "Attack (Lowest First)",
		"attack-desc": "Attack (Highest First)",
	};

	return sortOptions[sortBy] || "Name (A-Z)";
}
