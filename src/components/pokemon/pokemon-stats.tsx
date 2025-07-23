"use client";

interface PokemonStat {
	base_stat: number;
	pokemon_v2_stat: {
		name: string;
	};
}

interface PokemonStatsProps {
	stats: PokemonStat[];
	primaryTypeColor: string;
}

const STAT_NAMES: Record<string, string> = {
	hp: "HP",
	attack: "Attack",
	defense: "Defense",
	"special-attack": "Sp. Attack",
	"special-defense": "Sp. Defense",
	speed: "Speed",
};

const STAT_MAX_VALUES: Record<string, number> = {
	hp: 255,
	attack: 190,
	defense: 230,
	"special-attack": 194,
	"special-defense": 230,
	speed: 180,
};

export function PokemonStats({ stats, primaryTypeColor }: PokemonStatsProps) {
	const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

	return (
		<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
			<h2 className="mb-6 font-bold text-2xl text-gray-800">Base Stats</h2>

			<div className="space-y-4">
				{stats.map((stat) => {
					const statName = stat.pokemon_v2_stat.name;
					const displayName = STAT_NAMES[statName] || statName;
					const maxValue = STAT_MAX_VALUES[statName] || 200;
					const percentage = Math.min((stat.base_stat / maxValue) * 100, 100);

					return (
						<div className="flex items-center gap-4" key={statName}>
							<div className="w-24 text-right font-medium text-gray-600 text-sm">
								{displayName}
							</div>
							<div className="flex flex-1 items-center gap-3">
								<div className="w-12 font-bold text-gray-800 text-sm">
									{stat.base_stat}
								</div>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-full rounded-full transition-all duration-500 ease-out"
										style={{
											backgroundColor: primaryTypeColor,
											width: `${percentage}%`,
										}}
									/>
								</div>
							</div>
						</div>
					);
				})}

				{/* Total Stats */}
				<div className="border-gray-200 border-t pt-4">
					<div className="flex items-center gap-4">
						<div className="w-24 text-right font-bold text-gray-800 text-sm">
							Total
						</div>
						<div className="flex flex-1 items-center gap-3">
							<div
								className="w-12 font-bold text-sm"
								style={{ color: primaryTypeColor }}
							>
								{totalStats}
							</div>
							<div className="text-gray-500 text-sm">Base stat total</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
