/**
 * Pokemon type color utilities
 */

export const POKEMON_TYPE_COLORS: Record<string, string> = {
	normal: "#A8A878",
	fire: "#F08030",
	water: "#6890F0",
	electric: "#F8D030",
	grass: "#78C850",
	ice: "#98D8D8",
	fighting: "#C03028",
	poison: "#A040A0",
	ground: "#E0C068",
	flying: "#A890F0",
	psychic: "#F85888",
	bug: "#A8B820",
	rock: "#B8A038",
	ghost: "#705898",
	dragon: "#7038F8",
	dark: "#705848",
	steel: "#B8B8D0",
	fairy: "#EE99AC",
};

/**
 * Get the color for a Pokemon type
 */
export function getTypeColor(type: string): string {
	return POKEMON_TYPE_COLORS[type.toLowerCase()] || POKEMON_TYPE_COLORS.normal;
}

/**
 * Get a lighter version of the type color for backgrounds
 */
export function getTypeColorLight(type: string): string {
	const color = getTypeColor(type);
	// Convert hex to RGB and add opacity
	const hex = color.replace("#", "");
	const r = Number.parseInt(hex.substr(0, 2), 16);
	const g = Number.parseInt(hex.substr(2, 2), 16);
	const b = Number.parseInt(hex.substr(4, 2), 16);
	return `rgba(${r}, ${g}, ${b}, 0.2)`;
}

/**
 * Get a darker version of the type color for text
 */
export function getTypeColorDark(type: string): string {
	const color = getTypeColor(type);
	// Convert hex to RGB and darken
	const hex = color.replace("#", "");
	const r = Math.max(0, Number.parseInt(hex.substr(0, 2), 16) - 40);
	const g = Math.max(0, Number.parseInt(hex.substr(2, 2), 16) - 40);
	const b = Math.max(0, Number.parseInt(hex.substr(4, 2), 16) - 40);
	return `rgb(${r}, ${g}, ${b})`;
}
