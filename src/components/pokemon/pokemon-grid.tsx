import type { Pokemon } from "@/lib/types/pokemon";
import { cn } from "@/lib/utils";
import { PokemonCardSkeleton } from "../ui/pokemon-card-skeleton";
import { PokemonCard } from "./pokemon-card";

interface PokemonGridProps {
	pokemon: Pokemon[];
	loading?: boolean;
	className?: string;
	onPokemonClick?: (pokemon: Pokemon) => void;
	showStats?: boolean;
	variant?: "default" | "compact" | "detailed";
	columns?: {
		sm?: number;
		md?: number;
		lg?: number;
		xl?: number;
	};
}

export function PokemonGrid({
	loading,
	pokemon,
	className,
	onPokemonClick,
	showStats = true,
	variant = "detailed",
	columns = { sm: 1, md: 2, lg: 3, xl: 4 },
}: PokemonGridProps) {
	const getGridClasses = () => {
		const { sm = 1, md = 2, lg = 3, xl = 4 } = columns;

		// Use explicit class names that Tailwind can detect
		const smClasses = {
			1: "grid-cols-1",
			2: "grid-cols-2",
			3: "grid-cols-3",
			4: "grid-cols-4",
			5: "grid-cols-5",
			6: "grid-cols-6",
		};

		const mdClasses = {
			1: "md:grid-cols-1",
			2: "md:grid-cols-2",
			3: "md:grid-cols-3",
			4: "md:grid-cols-4",
			5: "md:grid-cols-5",
			6: "md:grid-cols-6",
		};

		const lgClasses = {
			1: "lg:grid-cols-1",
			2: "lg:grid-cols-2",
			3: "lg:grid-cols-3",
			4: "lg:grid-cols-4",
			5: "lg:grid-cols-5",
			6: "lg:grid-cols-6",
		};

		const xlClasses = {
			1: "xl:grid-cols-1",
			2: "xl:grid-cols-2",
			3: "xl:grid-cols-3",
			4: "xl:grid-cols-4",
			5: "xl:grid-cols-5",
			6: "xl:grid-cols-6",
		};

		return cn(
			"grid gap-6",
			smClasses[sm as keyof typeof smClasses],
			mdClasses[md as keyof typeof mdClasses],
			lgClasses[lg as keyof typeof lgClasses],
			xlClasses[xl as keyof typeof xlClasses]
		);
	};

	if (loading) {
		return <PokemonCardSkeleton count={12} />;
	}

	return (
		<div className={cn(getGridClasses(), className)}>
			{pokemon.map((poke) => (
				<PokemonCard
					key={poke.name}
					onClick={onPokemonClick}
					pokemon={poke}
					showStats={showStats}
					variant={variant}
				/>
			))}
		</div>
	);
}
