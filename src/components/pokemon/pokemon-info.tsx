"use client";

import type { Pokemon } from "@/lib/types/pokemon";

interface PokemonInfoProps {
	pokemon: Pokemon;
}

export function PokemonInfo({ pokemon }: PokemonInfoProps) {
	// Convert height from decimeters to feet/inches and meters
	const heightInMeters = (pokemon.height / 10).toFixed(1);
	const heightInFeet = Math.floor((pokemon.height * 3.937) / 12);
	const heightInInches = Math.round((pokemon.height * 3.937) % 12);

	// Convert weight from hectograms to pounds and kilograms
	const weightInKg = (pokemon.weight / 10).toFixed(1);
	const weightInLbs = (pokemon.weight * 0.220_462).toFixed(1);

	return (
		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
			<h2 className="mb-6 font-bold text-2xl text-gray-800">Pokemon Data</h2>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{/* Height */}
				<div className="space-y-2">
					<h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
						Height
					</h3>
					<div className="space-y-1">
						<div className="font-bold text-2xl text-gray-800">
							{heightInMeters} m
						</div>
						<div className="text-gray-500 text-sm">
							{heightInFeet}'{heightInInches}"
						</div>
					</div>
				</div>

				{/* Weight */}
				<div className="space-y-2">
					<h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
						Weight
					</h3>
					<div className="space-y-1">
						<div className="font-bold text-2xl text-gray-800">
							{weightInKg} kg
						</div>
						<div className="text-gray-500 text-sm">{weightInLbs} lbs</div>
					</div>
				</div>

				{/* Base Experience */}
				{pokemon.base_experience && (
					<div className="space-y-2">
						<h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
							Base Experience
						</h3>
						<div className="font-bold text-2xl text-gray-800">
							{pokemon.base_experience}
						</div>
					</div>
				)}

				{/* Pokemon Number */}
				<div className="space-y-2">
					<h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">
						Pokédex No.
					</h3>
					<div className="font-bold text-2xl text-gray-800">
						#{pokemon.id.toString().padStart(3, "0")}
					</div>
				</div>
			</div>

			{/* Types */}
			<div className="mt-6 border-gray-200 border-t pt-6">
				<h3 className="mb-3 font-semibold text-gray-600 text-sm uppercase tracking-wide">
					Type
				</h3>
				<div className="flex gap-2">
					{pokemon.pokemon_v2_pokemontypes?.map((typeInfo) => (
						<span
							className="rounded-full border bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm capitalize"
							key={typeInfo.pokemon_v2_type.id}
						>
							{typeInfo.pokemon_v2_type.name}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}
