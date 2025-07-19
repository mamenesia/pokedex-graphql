import { POKEBALL_PLACEHOLDER } from "@/data/constants/assets";
import type { ParsedSprites, PokemonSprites } from "@/lib/types/pokemon";

/**
 * Safely parse Pokemon sprites JSON string
 * @param spritesData - Array of sprite objects from GraphQL
 * @returns Parsed sprites object or null if parsing fails
 */
export function parsePokemonSprites(
  spritesData: PokemonSprites[]
): ParsedSprites | null {
  try {
    if (!spritesData || spritesData.length === 0) {
      console.log("No sprites data");
      return null;
    }

    const spritesString = spritesData[0]?.sprites;

    if (!spritesString) {
      console.log("No sprites string");
      return null;
    }

    return spritesString as ParsedSprites;
  } catch (error) {
    // Silently handle parsing errors - this is expected for some Pokemon
    console.warn(error);
    return null;
  }
}

/**
 * Get the best available Pokemon image URL
 * @param spritesData - Array of sprite objects from GraphQL
 * @param fallback - Fallback image URL
 * @returns Best available image URL
 */
export function getPokemonImageUrl(
  spritesData: PokemonSprites[],
  fallback: string = POKEBALL_PLACEHOLDER
): string {
  const sprites = parsePokemonSprites(spritesData);

  if (!sprites) {
    return fallback;
  }

  // Priority order for best image quality
  const imageOptions = [
    sprites.other?.["official-artwork"]?.front_default,
    sprites.other?.home?.front_default,
    sprites.front_default,
  ];

  for (const imageUrl of imageOptions) {
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "") {
      return imageUrl;
    }
  }

  return fallback;
}

/**
 * Capitalize Pokemon name properly
 * @param name - Pokemon name
 * @returns Capitalized name
 */
export function capitalizePokemonName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format Pokemon ID with leading zeros
 * @param id - Pokemon ID
 * @returns Formatted ID string (e.g., "001", "025", "150")
 */
export function formatPokemonId(id: number): string {
  return id.toString().padStart(3, "0");
}
