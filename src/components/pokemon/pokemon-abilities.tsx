"use client";

import { Eye, EyeOff } from "lucide-react";
import type { PokemonAbilityRelation } from "@/lib/types/pokemon";

interface PokemonAbilitiesProps {
	abilities: PokemonAbilityRelation[];
	className?: string;
}

export function PokemonAbilities({
	abilities,
	className = "",
}: PokemonAbilitiesProps) {
	if (!abilities || abilities.length === 0) {
		return null;
	}

	return (
		<div className={`rounded-lg border bg-white p-4 shadow-sm ${className}`}>
			<h3 className="mb-3 flex items-center font-semibold text-gray-800 text-lg">
				<Eye className="mr-2 h-5 w-5 text-blue-600" />
				Abilities
			</h3>

			<div className="space-y-3">
				{abilities.map((abilityRelation, index) => {
					const ability = abilityRelation.pokemon_v2_ability;
					const effectText = ability.pokemon_v2_abilityeffecttexts?.[0];

					return (
						<div
							className={`rounded-lg border-l-4 p-3 ${
								abilityRelation.is_hidden
									? "border-l-purple-500 bg-purple-50"
									: "border-l-blue-500 bg-blue-50"
							}`}
							key={`${ability.id}-${index}`}
						>
							<div className="mb-2 flex items-center justify-between">
								<h4 className="flex items-center font-medium text-gray-800 capitalize">
									{ability.name.replace("-", " ")}
									{abilityRelation.is_hidden && (
										<span className="ml-2 inline-flex items-center rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-800 text-xs">
											<EyeOff className="mr-1 h-3 w-3" />
											Hidden
										</span>
									)}
								</h4>
							</div>

							{effectText && (
								<div className="text-gray-600 text-sm">
									{effectText.short_effect && (
										<p className="mb-1 font-medium">
											{effectText.short_effect}
										</p>
									)}
									{effectText.effect &&
										effectText.effect !== effectText.short_effect && (
											<p className="text-xs leading-relaxed">
												{effectText.effect}
											</p>
										)}
								</div>
							)}

							{!effectText && (
								<p className="text-gray-500 text-sm italic">
									No description available
								</p>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
