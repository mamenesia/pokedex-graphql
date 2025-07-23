// Generation utility functions

export const GENERATION_NAMES: Record<number, string> = {
	1: "Generation I (Kanto)",
	2: "Generation II (Johto)",
	3: "Generation III (Hoenn)",
	4: "Generation IV (Sinnoh)",
	5: "Generation V (Unova)",
	6: "Generation VI (Kalos)",
	7: "Generation VII (Alola)",
	8: "Generation VIII (Galar)",
	9: "Generation IX (Paldea)",
};

export const GENERATION_SHORT_NAMES: Record<number, string> = {
	1: "Gen I",
	2: "Gen II",
	3: "Gen III",
	4: "Gen IV",
	5: "Gen V",
	6: "Gen VI",
	7: "Gen VII",
	8: "Gen VIII",
	9: "Gen IX",
};

/**
 * Get the full generation name for a generation ID
 */
export function getGenerationName(generationId: number): string {
	return GENERATION_NAMES[generationId] || `Generation ${generationId}`;
}

/**
 * Get the short generation name for a generation ID
 */
export function getGenerationShortName(generationId: number): string {
	return GENERATION_SHORT_NAMES[generationId] || `Gen ${generationId}`;
}

/**
 * Get the generation number as a Roman numeral
 */
export function getGenerationRoman(generationId: number): string {
	const romanNumerals: Record<number, string> = {
		1: "I",
		2: "II",
		3: "III",
		4: "IV",
		5: "V",
		6: "VI",
		7: "VII",
		8: "VIII",
		9: "IX",
	};

	return romanNumerals[generationId] || generationId.toString();
}
