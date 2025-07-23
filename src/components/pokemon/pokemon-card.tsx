import Image from "next/image";
import { ComparisonButton } from "@/components/pokemon/comparison-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { POKEBALL_PLACEHOLDER } from "@/data/constants/assets";
import { POKEMON_TYPE_COLORS } from "@/data/constants/pokemon";
import type { Pokemon } from "@/lib/types/pokemon";
import { cn } from "@/lib/utils";
import { getGenerationShortName } from "@/lib/utils/generation";
import {
	capitalizePokemonName,
	formatPokemonId,
	getPokemonImageUrl,
} from "@/lib/utils/pokemon";

interface PokemonCardProps {
	pokemon: Pokemon;
	className?: string;
	onClick?: (pokemon: Pokemon) => void;
	showStats?: boolean;
	variant?: "default" | "compact" | "detailed";
}

export function PokemonCard({
	pokemon,
	className,
	onClick,
	showStats = true,
	variant = "default",
}: PokemonCardProps) {
	const imageUrl = getPokemonImageUrl(pokemon.pokemon_v2_pokemonsprites);
	const pokemonName = capitalizePokemonName(pokemon.name);
	const pokemonId = formatPokemonId(pokemon.id);

	// Get primary type for gradient background
	const primaryType =
		pokemon.pokemon_v2_pokemontypes[0]?.pokemon_v2_type.name || "normal";
	const secondaryType =
		pokemon.pokemon_v2_pokemontypes[1]?.pokemon_v2_type.name;

	const handleClick = () => {
		onClick?.(pokemon);
	};

	const getCardClasses = () => {
		const baseClasses = cn(
			"group relative overflow-hidden border-0 bg-gradient-to-br shadow-md",
			"hover:-translate-y-2 hover:shadow-black/20 hover:shadow-xl",
			"transition-all duration-300 ease-out",
			onClick && "cursor-pointer hover:scale-[1.02]",
			getGradientBackground(),
			className
		);

		switch (variant) {
			case "compact":
				return cn(baseClasses, "p-3");
			case "detailed":
				return cn(baseClasses, "p-6");
			default:
				return cn(baseClasses, "p-4");
		}
	};

	const getGradientBackground = () => {
		const primaryColor = getTypeGradientColor(primaryType);
		const secondaryColor = secondaryType
			? getTypeGradientColor(secondaryType)
			: primaryColor;

		return `from-${primaryColor}/20 via-white to-${secondaryColor}/10`;
	};

	const getTypeGradientColor = (type: string) => {
		const colorMap: Record<string, string> = {
			fire: "red-500",
			water: "blue-500",
			grass: "green-500",
			electric: "yellow-500",
			psychic: "purple-500",
			ice: "cyan-500",
			dragon: "indigo-600",
			dark: "gray-800",
			fairy: "pink-500",
			fighting: "red-600",
			poison: "purple-600",
			ground: "yellow-600",
			flying: "blue-400",
			bug: "green-600",
			rock: "yellow-700",
			ghost: "purple-700",
			steel: "gray-500",
			normal: "gray-400",
		};

		return colorMap[type] || "gray-400";
	};

	const getImageSize = () => {
		switch (variant) {
			case "compact":
				return { width: 60, height: 60, containerClass: "h-15 w-15" };
			case "detailed":
				return { width: 120, height: 120, containerClass: "h-30 w-30" };
			default:
				return { width: 96, height: 96, containerClass: "h-24 w-24" };
		}
	};

	const imageConfig = getImageSize();

	return (
		<Card className={getCardClasses()} onClick={handleClick}>
			{/* Decorative background pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-4 right-4 h-16 w-16 rounded-full border-2 border-current" />
				<div className="absolute bottom-4 left-4 h-8 w-8 rounded-full border border-current" />
			</div>

			<CardHeader
				className={cn(
					"relative text-center",
					variant === "compact" ? "pb-2" : "pb-3"
				)}
			>
				{/* Pokemon ID Badge */}
				<div className="absolute top-0 right-0 rounded-bl-lg bg-black/10 px-2 py-1 backdrop-blur-sm">
					<span className="font-bold text-gray-700 text-xs">#{pokemonId}</span>
				</div>

				{/* Comparison Button */}
				<div className="absolute top-2 left-2">
					<ComparisonButton pokemon={pokemon} size="sm" />
				</div>

				{/* Pokemon Image */}
				<div
					className={cn(
						"relative mx-auto mb-4 drop-shadow-lg",
						imageConfig.containerClass
					)}
				>
					<div className="absolute inset-0 scale-75 rounded-full bg-white/30 blur-xl" />
					<Image
						alt={pokemonName}
						blurDataURL={POKEBALL_PLACEHOLDER}
						className="relative object-contain transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl"
						fill
						loading="lazy"
						onError={(e) => {
							(e.target as HTMLImageElement).src = POKEBALL_PLACEHOLDER;
						}}
						placeholder="blur"
						src={imageUrl}
					/>
				</div>

				{/* Pokemon Name & Generation - Moved below image */}
				<div className="space-y-2 text-center">
					<CardTitle
						className={cn(
							"font-bold tracking-wide",
							variant === "compact" ? "text-sm" : "text-lg"
						)}
					>
						{pokemonName}
					</CardTitle>

					{/* Pokemon Generation */}
					{pokemon.pokemon_v2_pokemonspecy?.generation_id && (
						<div className="flex justify-center">
							<span className="inline-flex items-center rounded-full bg-black/10 px-2 py-1 font-medium text-gray-700 text-xs">
								{getGenerationShortName(
									pokemon.pokemon_v2_pokemonspecy.generation_id
								)}
							</span>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent className="relative pt-0 text-center">
				{/* Pokemon Types */}
				<div className="mb-4 flex flex-wrap justify-center gap-2">
					{pokemon.pokemon_v2_pokemontypes.map((typeRelation) => {
						const typeName = typeRelation.pokemon_v2_type.name;
						const typeColor = POKEMON_TYPE_COLORS[typeName] || "bg-gray-400";

						return (
							<span
								className={cn(
									"inline-flex items-center rounded-full px-3 py-1.5 font-semibold text-white capitalize",
									"shadow-lg backdrop-blur-sm transition-transform hover:scale-105",
									typeColor,
									variant === "compact" ? "text-xs" : "text-sm"
								)}
								key={typeRelation.pokemon_v2_type.id}
							>
								{typeName}
							</span>
						);
					})}
				</div>

				{/* Pokemon Stats (if enabled) */}
				{showStats && variant !== "compact" && (
					<div className="space-y-3">
						<h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">
							Base Stats
						</h4>
						<div className="space-y-2">
							{pokemon.pokemon_v2_pokemonstats
								.slice(0, 4)
								.map((statRelation) => {
									const statName = statRelation.pokemon_v2_stat.name.replace(
										"-",
										" "
									);
									const statValue = statRelation.base_stat;
									const statPercentage = Math.min((statValue / 150) * 100, 100); // Normalize to 150 max

									return (
										<div
											className="space-y-1"
											key={statRelation.pokemon_v2_stat.name}
										>
											<div className="flex items-center justify-between text-xs">
												<span className="font-medium text-gray-600 capitalize">
													{statName}
												</span>
												<span className="font-bold text-gray-800">
													{statValue}
												</span>
											</div>
											<div className="h-1.5 w-full rounded-full bg-gray-200">
												<div
													className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
													style={{ width: `${statPercentage}%` }}
												/>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
