"use client";

import { Shield, Sword, Zap } from "lucide-react";
import type { PokemonMoveRelation } from "@/lib/types/pokemon";
import { getTypeColor } from "@/lib/utils/pokemon-colors";

interface PokemonMovesProps {
	moves: PokemonMoveRelation[];
	className?: string;
}

export function PokemonMoves({ moves, className = "" }: PokemonMovesProps) {
	if (!moves || moves.length === 0) {
		return null;
	}

	// Sort moves by level learned
	const sortedMoves = [...moves].sort((a, b) => a.level - b.level);

	const getDamageClassIcon = (damageClass: string) => {
		switch (damageClass) {
			case "physical":
				return <Sword className="h-4 w-4" />;
			case "special":
				return <Zap className="h-4 w-4" />;
			case "status":
				return <Shield className="h-4 w-4" />;
			default:
				return <Sword className="h-4 w-4" />;
		}
	};

	const getDamageClassColor = (damageClass: string) => {
		switch (damageClass) {
			case "physical":
				return "text-red-600 bg-red-50";
			case "special":
				return "text-purple-600 bg-purple-50";
			case "status":
				return "text-gray-600 bg-gray-50";
			default:
				return "text-gray-600 bg-gray-50";
		}
	};

	return (
		<div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
			<h3 className="mb-3 flex items-center font-semibold text-gray-800 text-lg">
				<Sword className="mr-2 h-5 w-5 text-orange-600" />
				Level-up Moves
			</h3>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-gray-200 border-b">
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Level
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Move
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Type
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Category
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Power
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								Accuracy
							</th>
							<th className="px-3 py-2 text-left font-medium text-gray-600">
								PP
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedMoves.map((moveRelation, index) => {
							const move = moveRelation.pokemon_v2_move;
							const typeColor = getTypeColor(move.pokemon_v2_type.name);
							const damageClass = move.pokemon_v2_movedamageclass.name;
							const effectText = move.pokemon_v2_moveeffecttexts?.[0];

							return (
								<tr
									className="border-gray-100 border-b transition-colors hover:bg-gray-50"
									key={`${move.id}-${index}`}
								>
									<td className="px-3 py-3">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800 text-xs">
											{moveRelation.level}
										</span>
									</td>
									<td className="px-3 py-3">
										<div>
											<div className="font-medium text-gray-800 capitalize">
												{move.name.replace("-", " ")}
											</div>
											{effectText?.short_effect && (
												<div className="mt-1 max-w-xs text-gray-500 text-xs">
													{effectText.short_effect}
												</div>
											)}
										</div>
									</td>
									<td className="px-3 py-3">
										<span
											className="inline-block rounded px-2 py-1 font-medium text-white text-xs capitalize"
											style={{ backgroundColor: typeColor }}
										>
											{move.pokemon_v2_type.name}
										</span>
									</td>
									<td className="px-3 py-3">
										<span
											className={`inline-flex items-center rounded px-2 py-1 font-medium text-xs capitalize ${getDamageClassColor(
												damageClass
											)}`}
										>
											{getDamageClassIcon(damageClass)}
											<span className="ml-1">{damageClass}</span>
										</span>
									</td>
									<td className="px-3 py-3 text-center">
										<span className="font-medium text-gray-800">
											{move.power || "—"}
										</span>
									</td>
									<td className="px-3 py-3 text-center">
										<span className="font-medium text-gray-800">
											{move.accuracy ? `${move.accuracy}%` : "—"}
										</span>
									</td>
									<td className="px-3 py-3 text-center">
										<span className="font-medium text-gray-800">{move.pp}</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{moves.length >= 20 && (
				<div className="mt-3 text-center">
					<p className="text-gray-500 text-sm">
						Showing first 20 level-up moves (up to level 50)
					</p>
				</div>
			)}
		</div>
	);
}
