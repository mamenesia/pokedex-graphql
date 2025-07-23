"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PokemonComparisonCard } from "@/components/pokemon/pokemon-comparison-card";
import { BackButton } from "@/components/ui/back-button";
import { useSearchStore } from "@/stores/search-store";

export default function ComparePage() {
	const router = useRouter();
	const { comparison } = useSearchStore();
	const { selectedPokemon } = comparison;

	// Redirect if not enough Pokemon selected
	useEffect(() => {
		if (selectedPokemon.length < 2) {
			router.push("/");
		}
	}, [selectedPokemon.length, router]);

	if (selectedPokemon.length < 2) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="text-center">
					<h1 className="mb-4 font-bold text-2xl text-gray-800">
						Not Enough Pokemon Selected
					</h1>
					<p className="mb-6 text-gray-600">
						Please select at least 2 Pokemon to compare.
					</p>
					<button
						className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
						onClick={() => router.push("/")}
					>
						Go Back to Pokemon List
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* Header */}
			<div className="border-b bg-white shadow-sm">
				<div className="mx-auto max-w-7xl px-4 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<BackButton />
							<div>
								<h1 className="font-bold text-3xl text-gray-900">
									Pokemon Comparison
								</h1>
								<p className="mt-1 text-gray-600">
									Comparing {selectedPokemon.length} Pokemon side by side
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Comparison Grid */}
			<div className="mx-auto max-w-7xl px-4 py-8">
				<div
					className={`grid gap-6 ${selectedPokemon.length === 2 ? "grid-cols-1 lg:grid-cols-2" : ""} ${selectedPokemon.length === 3 ? "grid-cols-1 lg:grid-cols-3" : ""} ${selectedPokemon.length === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : ""} `}
				>
					{selectedPokemon.map((pokemon, index) => (
						<PokemonComparisonCard
							key={pokemon.id}
							pokemon={pokemon}
							position={index + 1}
							totalCount={selectedPokemon.length}
						/>
					))}
				</div>

				{/* Stats Comparison Table */}
				{selectedPokemon.length >= 2 && (
					<div className="mt-12">
						<div className="overflow-hidden rounded-xl bg-white shadow-lg">
							<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
								<h2 className="font-bold text-white text-xl">
									Stats Comparison
								</h2>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider">
												Stat
											</th>
											{selectedPokemon.map((pokemon) => (
												<th
													className="px-6 py-3 text-center font-medium text-gray-500 text-xs uppercase tracking-wider"
													key={pokemon.id}
												>
													<div className="flex flex-col items-center">
														<span className="font-semibold text-gray-800 capitalize">
															{pokemon.name}
														</span>
														<span className="text-gray-500">#{pokemon.id}</span>
													</div>
												</th>
											))}
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{[
											"hp",
											"attack",
											"defense",
											"special-attack",
											"special-defense",
											"speed",
										].map((statName) => {
											const statValues = selectedPokemon.map((pokemon) => {
												const stat = pokemon.pokemon_v2_pokemonstats?.find(
													(s) => s.pokemon_v2_stat.name === statName
												);
												return stat?.base_stat || 0;
											});

											const maxValue = Math.max(...statValues);
											const minValue = Math.min(...statValues);

											return (
												<tr key={statName}>
													<td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 text-sm capitalize">
														{statName.replace("-", " ")}
													</td>
													{selectedPokemon.map((pokemon, index) => {
														const stat = pokemon.pokemon_v2_pokemonstats?.find(
															(s) => s.pokemon_v2_stat.name === statName
														);
														const value = stat?.base_stat || 0;
														const isHighest =
															value === maxValue && maxValue !== minValue;
														const isLowest =
															value === minValue && maxValue !== minValue;

														return (
															<td
																className="whitespace-nowrap px-6 py-4 text-center"
																key={pokemon.id}
															>
																<div className="flex flex-col items-center">
																	<span
																		className={`font-bold text-lg ${isHighest ? "text-green-600" : isLowest ? "text-red-500" : "text-gray-800"} `}
																	>
																		{value}
																	</span>
																	{isHighest && (
																		<span className="font-medium text-green-600 text-xs">
																			Highest
																		</span>
																	)}
																	{isLowest && (
																		<span className="font-medium text-red-500 text-xs">
																			Lowest
																		</span>
																	)}
																</div>
															</td>
														);
													})}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
