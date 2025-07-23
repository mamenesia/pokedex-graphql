"use client";

import { Eye, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTypeColor } from "@/lib/utils/pokemon-colors";
import { useSearchStore } from "@/stores/search-store";

export function ComparisonBar() {
	const router = useRouter();
	const {
		comparison,
		removeFromComparison,
		clearComparison,
		toggleComparison,
	} = useSearchStore();

	const { selectedPokemon, isComparing } = comparison;

	// Don't show the bar if no Pokemon are selected
	if (selectedPokemon.length === 0) {
		return null;
	}

	const handleCompare = () => {
		if (selectedPokemon.length >= 2) {
			router.push("/compare");
		}
	};

	const canCompare = selectedPokemon.length >= 2;

	return (
		<div className="fixed right-0 bottom-0 left-0 z-40 border-gray-200 border-t-2 bg-white shadow-lg">
			<div className="mx-auto max-w-7xl px-4 py-3">
				<div className="flex items-center justify-between">
					{/* Left side - Selected Pokemon */}
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<span className="font-medium text-gray-700 text-sm">
								Compare Pokemon ({selectedPokemon.length}/4):
							</span>
						</div>

						<div className="flex items-center space-x-2">
							{selectedPokemon.map((pokemon) => {
								const primaryType =
									pokemon.pokemon_v2_pokemontypes?.[0]?.pokemon_v2_type?.name ||
									"normal";
								const typeColor = getTypeColor(primaryType);

								return (
									<div
										className="group relative flex items-center space-x-2 rounded-lg border bg-gray-50 p-2"
										key={pokemon.id}
									>
										{/* Pokemon Image */}
										<div className="relative h-8 w-8">
											<Image
												alt={pokemon.name}
												className="object-contain"
												fill
												sizes="32px"
												src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
											/>
										</div>

										{/* Pokemon Name */}
										<span className="font-medium text-gray-800 text-sm capitalize">
											{pokemon.name}
										</span>

										{/* Type Badge */}
										<span
											className="rounded px-2 py-1 font-medium text-white text-xs"
											style={{ backgroundColor: typeColor }}
										>
											{primaryType}
										</span>

										{/* Remove Button */}
										<button
											className="ml-1 p-1 text-gray-400 transition-colors hover:text-red-500"
											onClick={() => removeFromComparison(pokemon.id)}
											title="Remove from comparison"
										>
											<X size={14} />
										</button>
									</div>
								);
							})}
						</div>
					</div>

					{/* Right side - Actions */}
					<div className="flex items-center space-x-3">
						{/* Compare Button */}
						<button
							className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
								canCompare
									? "bg-blue-600 text-white hover:bg-blue-700"
									: "cursor-not-allowed bg-gray-300 text-gray-500"
							} `}
							disabled={!canCompare}
							onClick={handleCompare}
							title={
								canCompare
									? "Compare selected Pokemon"
									: "Select at least 2 Pokemon to compare"
							}
						>
							<Eye size={16} />
							<span>Compare</span>
						</button>

						{/* Clear All Button */}
						<button
							className="px-3 py-2 text-gray-600 transition-colors hover:text-red-600"
							onClick={clearComparison}
							title="Clear all selections"
						>
							<RotateCcw size={16} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
