/** biome-ignore-all lint/complexity/noForEach: <explanation> */
"use client";

import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EvolutionChain, EvolutionSpecies } from "@/lib/types/pokemon";
import { getPokemonImageUrl } from "@/lib/utils/pokemon";

interface PokemonEvolutionChainProps {
	evolutionChain: EvolutionChain;
	currentPokemonId: number;
	className?: string;
}

export function PokemonEvolutionChain({
	evolutionChain,
	currentPokemonId,
	className = "",
}: PokemonEvolutionChainProps) {
	const router = useRouter();
	const [isExpanded, setIsExpanded] = useState(true);

	if (!evolutionChain?.pokemon_v2_pokemonspecies) {
		return null;
	}

	// Build evolution chain structure
	const buildEvolutionChain = (species: EvolutionSpecies[]) => {
		const chains: EvolutionSpecies[][] = [];

		// Find base species (those that don't evolve from anything)
		const baseSpecies = species.filter((s) => !s.evolves_from_species_id);

		baseSpecies.forEach((base) => {
			const chain = [base];
			let current = base;

			// Follow evolution chain
			while (true) {
				const nextEvolution = species.find(
					(s) => s.evolves_from_species_id === current.id
				);
				if (!nextEvolution) {
					break;
				}
				chain.push(nextEvolution);
				current = nextEvolution;
			}

			if (chain.length > 1) {
				chains.push(chain);
			}
		});

		return chains;
	};

	const evolutionChains = buildEvolutionChain(
		evolutionChain.pokemon_v2_pokemonspecies
	);

	if (evolutionChains.length === 0) {
		return null;
	}

	const getEvolutionRequirement = (species: EvolutionSpecies) => {
		const evolution = species.pokemon_v2_pokemonevolutions?.[0];
		if (!evolution) {
			return "";
		}

		const parts: string[] = [];
		if (evolution.min_level) {
			parts.push(`Level ${evolution.min_level}`);
		}
		if (evolution.pokemon_v2_item?.name) {
			parts.push(evolution.pokemon_v2_item.name.replace("-", " "));
		}
		if (
			evolution.pokemon_v2_evolutiontrigger?.name &&
			evolution.pokemon_v2_evolutiontrigger.name !== "level-up"
		) {
			parts.push(evolution.pokemon_v2_evolutiontrigger.name.replace("-", " "));
		}

		return parts.join(", ") || "Unknown";
	};

	const handlePokemonClick = (pokemonId: number) => {
		if (pokemonId !== currentPokemonId) {
			router.push(`/pokemon/${pokemonId}`);
		}
	};

	return (
		<div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
			<div className="mb-3 flex items-center justify-between">
				<h3 className="flex items-center font-semibold text-gray-800 text-lg">
					<ArrowRight className="mr-2 h-5 w-5 text-green-600" />
					Evolution Chain
				</h3>
				<button
					className="rounded-full p-1 transition-colors hover:bg-gray-100"
					onClick={() => setIsExpanded(!isExpanded)}
					type="button"
				>
					{isExpanded ? (
						<ChevronUp className="h-4 w-4 text-gray-600" />
					) : (
						<ChevronDown className="h-4 w-4 text-gray-600" />
					)}
				</button>
			</div>

			{isExpanded && (
				<div className="space-y-6">
					{evolutionChains.map((chain, chainIndex) => (
						<div className="flex items-center justify-center" key={chainIndex}>
							<div className="flex items-center space-x-4 overflow-x-auto pb-2">
								{chain.map((species, index) => {
									const pokemon = species.pokemon_v2_pokemons?.[0];
									const isCurrentPokemon = pokemon?.id === currentPokemonId;
									const imageUrl = pokemon?.pokemon_v2_pokemonsprites
										? getPokemonImageUrl(pokemon.pokemon_v2_pokemonsprites)
										: "";

									return (
										<div className="flex items-center" key={species.id}>
											{/* Pokemon Card */}
											<button
												className={`relative min-w-[120px] cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 ${
													isCurrentPokemon
														? "border-blue-500 bg-blue-50 shadow-md"
														: "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
												} `}
												disabled={!pokemon}
												onClick={() =>
													pokemon && handlePokemonClick(pokemon.id)
												}
												type="button"
											>
												{isCurrentPokemon && (
													<div className="-top-2 -right-2 absolute rounded-full bg-blue-500 px-2 py-1 text-white text-xs">
														Current
													</div>
												)}

												{/* Pokemon Image */}
												<div className="relative mx-auto mb-2 h-16 w-16">
													{imageUrl ? (
														<Image
															alt={species.name}
															className="object-contain"
															fill
															sizes="64px"
															src={imageUrl}
														/>
													) : (
														<div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
															<span className="text-gray-400 text-xs">
																No Image
															</span>
														</div>
													)}
												</div>

												{/* Pokemon Name */}
												<div className="font-medium text-gray-800 text-sm capitalize">
													{species.name}
												</div>

												{/* Pokemon ID */}
												{pokemon && (
													<div className="text-gray-500 text-xs">
														#{pokemon.id.toString().padStart(3, "0")}
													</div>
												)}
											</button>

											{/* Evolution Arrow */}
											{index < chain.length - 1 && (
												<div className="mx-4 flex flex-col items-center">
													<ArrowRight className="mb-1 h-6 w-6 text-gray-400" />
													<div className="max-w-20 text-center text-gray-500 text-xs">
														{getEvolutionRequirement(chain[index + 1])}
													</div>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
