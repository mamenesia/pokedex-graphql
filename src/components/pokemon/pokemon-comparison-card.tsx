"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { Pokemon } from "@/lib/types/pokemon";
import { getTypeColor } from "@/lib/utils/pokemon-colors";
import { useSearchStore } from "@/stores/search-store";

interface PokemonComparisonCardProps {
	pokemon: Pokemon;
	position: number;
	totalCount: number;
}

export function PokemonComparisonCard({
	pokemon,
	position,
	totalCount,
}: PokemonComparisonCardProps) {
	const { removeFromComparison } = useSearchStore();

	const primaryType =
		pokemon.pokemon_v2_pokemontypes?.[0]?.pokemon_v2_type?.name || "normal";
	const secondaryType =
		pokemon.pokemon_v2_pokemontypes?.[1]?.pokemon_v2_type?.name;
	const primaryTypeColor = getTypeColor(primaryType);
	const secondaryTypeColor = secondaryType ? getTypeColor(secondaryType) : null;

	// Calculate total stats
	const totalStats =
		pokemon.pokemon_v2_pokemonstats?.reduce(
			(sum, stat) => sum + stat.base_stat,
			0
		) || 0;

	return (
		<div className="overflow-hidden rounded-xl border-2 border-gray-100 bg-white shadow-lg transition-all duration-200 hover:border-gray-200">
			{/* Header with position and remove button */}
			<div
				className="relative px-6 py-4 text-white"
				style={{
					background: `linear-gradient(135deg, ${primaryTypeColor} 0%, ${
						secondaryTypeColor || primaryTypeColor
					} 100%)`,
				}}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<span className="font-medium text-sm opacity-90">
							#{position} of {totalCount}
						</span>
					</div>
					<button
						className="rounded-full bg-white/20 p-1 transition-colors hover:bg-white/30"
						onClick={() => removeFromComparison(pokemon.id)}
						title="Remove from comparison"
						type="button"
					>
						<X size={16} />
					</button>
				</div>

				<div className="mt-2">
					<h3 className="font-bold text-2xl capitalize">{pokemon.name}</h3>
					<p className="text-sm opacity-90">
						#{pokemon.id.toString().padStart(3, "0")}
					</p>
				</div>
			</div>

			{/* Pokemon Image */}
			<div className="relative bg-gray-50 py-8">
				<div className="relative mx-auto h-32 w-32">
					<Image
						alt={pokemon.name}
						className="object-contain drop-shadow-lg"
						fill
						sizes="128px"
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
					/>
				</div>
			</div>

			{/* Pokemon Info */}
			<div className="px-6 py-4">
				{/* Types */}
				<div className="mb-4">
					<h4 className="mb-2 font-semibold text-gray-600 text-sm">Types</h4>
					<div className="flex space-x-2">
						<span
							className="rounded-full px-3 py-1 font-medium text-sm text-white"
							style={{ backgroundColor: primaryTypeColor }}
						>
							{primaryType}
						</span>
						{secondaryType && (
							<span
								className="rounded-full px-3 py-1 font-medium text-sm text-white"
								style={{
									backgroundColor: secondaryTypeColor || primaryTypeColor,
								}}
							>
								{secondaryType}
							</span>
						)}
					</div>
				</div>

				{/* Physical Stats */}
				<div className="mb-4">
					<h4 className="mb-2 font-semibold text-gray-600 text-sm">Physical</h4>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div>
							<span className="text-gray-500">Height:</span>
							<span className="ml-1 font-medium">
								{(pokemon.height / 10).toFixed(1)}m
							</span>
						</div>
						<div>
							<span className="text-gray-500">Weight:</span>
							<span className="ml-1 font-medium">
								{(pokemon.weight / 10).toFixed(1)}kg
							</span>
						</div>
					</div>
				</div>

				{/* Base Stats */}
				<div className="mb-4">
					<h4 className="mb-3 font-semibold text-gray-600 text-sm">
						Base Stats
					</h4>
					<div className="space-y-2">
						{pokemon.pokemon_v2_pokemonstats?.map((stat) => {
							const statName = stat.pokemon_v2_stat.name;
							const statValue = stat.base_stat;
							const percentage = Math.min((statValue / 255) * 100, 100);

							return (
								<div key={statName}>
									<div className="mb-1 flex items-center justify-between">
										<span className="font-medium text-gray-600 text-xs capitalize">
											{statName.replace("-", " ")}
										</span>
										<span className="font-bold text-gray-800 text-xs">
											{statValue}
										</span>
									</div>
									<div className="h-2 w-full rounded-full bg-gray-200">
										<div
											className="h-2 rounded-full transition-all duration-300"
											style={{
												width: `${percentage}%`,
												backgroundColor: primaryTypeColor,
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>

					{/* Total Stats */}
					<div className="mt-3 border-gray-200 border-t pt-3">
						<div className="flex items-center justify-between">
							<span className="font-semibold text-gray-700 text-sm">Total</span>
							<span
								className="font-bold text-lg"
								style={{ color: primaryTypeColor }}
							>
								{totalStats}
							</span>
						</div>
					</div>
				</div>

				{/* Base Experience */}
				{pokemon.base_experience && (
					<div className="border-gray-200 border-t pt-3">
						<div className="flex items-center justify-between">
							<span className="text-gray-600 text-sm">Base Experience</span>
							<span className="font-semibold text-gray-800">
								{pokemon.base_experience} XP
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
