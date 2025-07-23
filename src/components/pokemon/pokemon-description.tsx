"use client";

import type { Pokemon } from "@/lib/types/pokemon";

interface PokemonDescriptionProps {
	pokemon: Pokemon;
}

export function PokemonDescription({ pokemon }: PokemonDescriptionProps) {
	const flavorText =
		pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.[0]
			?.flavor_text;

	// Clean up the flavor text by removing unwanted characters and formatting
	const cleanFlavorText = flavorText
		?.replace(/\f/g, " ")
		?.replace(/\n/g, " ")
		?.replace(/\s+/g, " ")
		?.trim();

	if (!cleanFlavorText) {
		return null;
	}

	return (
		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
			<h2 className="mb-4 font-bold text-2xl text-gray-800">About</h2>
			<p className="text-gray-600 text-lg leading-relaxed">{cleanFlavorText}</p>
		</div>
	);
}
