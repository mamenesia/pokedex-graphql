"use client";

import Image from "next/image";
import type { Pokemon } from "@/lib/types/pokemon";
import { getPokemonImageUrl } from "@/lib/utils/pokemon";
import { PokemonAbilities } from "./pokemon-abilities";
import { PokemonDescription } from "./pokemon-description";
import { PokemonEvolutionChain } from "./pokemon-evolution-chain";
import { PokemonInfo } from "./pokemon-info";
import { PokemonMoves } from "./pokemon-moves";
import { PokemonStats } from "./pokemon-stats";

// Type color mapping for background colors (hex values)
const TYPE_COLORS: Record<string, string> = {
	normal: "#9CA3AF",
	fire: "#EF4444",
	water: "#3B82F6",
	electric: "#FACC15",
	grass: "#10B981",
	ice: "#93C5FD",
	fighting: "#B91C1C",
	poison: "#A855F7",
	ground: "#CA8A04",
	flying: "#818CF8",
	psychic: "#EC4899",
	bug: "#84CC16",
	rock: "#92400E",
	ghost: "#7C3AED",
	dragon: "#4338CA",
	dark: "#1F2937",
	steel: "#6B7280",
	fairy: "#F9A8D4",
};

function getTypeColor(typeName: string): string {
	return TYPE_COLORS[typeName.toLowerCase()] || TYPE_COLORS.normal;
}

interface PokemonDetailCardProps {
	pokemon: Pokemon;
}

export function PokemonDetailCard({ pokemon }: PokemonDetailCardProps) {
	const primaryType =
		pokemon.pokemon_v2_pokemontypes?.[0]?.pokemon_v2_type?.name || "normal";
	const typeColor = getTypeColor(primaryType);

	// Get Pokemon image using existing utility function
	const spriteUrl = getPokemonImageUrl(pokemon.pokemon_v2_pokemonsprites || []);

	return (
		<div className="mx-auto max-w-4xl">
			{/* Header Section */}
			<div
				className="relative overflow-hidden rounded-t-2xl p-8 text-white"
				style={{ backgroundColor: typeColor }}
			>
				<div className="relative z-10">
					<div className="mb-4 flex items-center justify-between">
						<div>
							<h1 className="mb-2 font-bold text-4xl capitalize">
								{pokemon.name}
							</h1>
							<div className="flex gap-2">
								{pokemon.pokemon_v2_pokemontypes?.map((typeInfo) => (
									<span
										className="rounded-full bg-white/20 px-3 py-1 font-medium text-sm capitalize backdrop-blur-sm"
										key={typeInfo.pokemon_v2_type.id}
									>
										{typeInfo.pokemon_v2_type.name}
									</span>
								))}
							</div>
						</div>
						<div className="text-right">
							<span className="font-bold text-6xl opacity-20">
								#{pokemon.id.toString().padStart(3, "0")}
							</span>
						</div>
					</div>
				</div>

				{/* Background Pattern */}
				<div className="absolute top-0 right-0 h-64 w-64 opacity-10">
					<div className="h-full w-full rounded-full border-8 border-white" />
				</div>
			</div>

			{/* Pokemon Image */}
			<div className="-mt-16 relative mb-8 flex justify-center">
				<div className="rounded-full border-8 border-white bg-white p-4 shadow-2xl">
					{spriteUrl ? (
						<Image
							alt={pokemon.name}
							className="h-48 w-48 object-contain"
							height={200}
							priority
							src={spriteUrl}
							width={200}
						/>
					) : (
						<div className="flex h-48 w-48 items-center justify-center rounded-full bg-gray-200">
							<span className="text-gray-400 text-lg">No Image</span>
						</div>
					)}
				</div>
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Column - Info */}
				<div className="space-y-6">
					<PokemonDescription pokemon={pokemon} />
					<PokemonInfo pokemon={pokemon} />
				</div>

				{/* Right Column - Stats */}
				<div>
					<PokemonStats
						primaryTypeColor={typeColor}
						stats={pokemon.pokemon_v2_pokemonstats || []}
					/>
				</div>
			</div>

			{/* Evolution Chain Section */}
			{pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain && (
				<div className="mt-8">
					<PokemonEvolutionChain
						currentPokemonId={pokemon.id}
						evolutionChain={
							pokemon.pokemon_v2_pokemonspecy.pokemon_v2_evolutionchain
						}
					/>
				</div>
			)}

			{/* Abilities and Moves Grid */}
			<div className="mt-8 grid grid-cols-1 gap-8">
				{/* Abilities Section */}
				{pokemon.pokemon_v2_pokemonabilities &&
					pokemon.pokemon_v2_pokemonabilities.length > 0 && (
						<PokemonAbilities abilities={pokemon.pokemon_v2_pokemonabilities} />
					)}

				{/* Moves Section */}
				{pokemon.pokemon_v2_pokemonmoves &&
					pokemon.pokemon_v2_pokemonmoves.length > 0 && (
						<PokemonMoves moves={pokemon.pokemon_v2_pokemonmoves} />
					)}
			</div>
		</div>
	);
}
