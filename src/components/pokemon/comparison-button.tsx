"use client";

import { Check, Plus, X } from "lucide-react";
import type { Pokemon } from "@/lib/types/pokemon";
import { useSearchStore } from "@/stores/search-store";

interface ComparisonButtonProps {
	pokemon: Pokemon;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function ComparisonButton({
	pokemon,
	size = "md",
	className = "",
}: ComparisonButtonProps) {
	const { comparison, addToComparison, removeFromComparison, isInComparison } =
		useSearchStore();

	const isSelected = isInComparison(pokemon.id);
	const isMaxReached = comparison.selectedPokemon.length >= 4;
	const canAdd = !(isSelected || isMaxReached);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering Pokemon card click

		if (isSelected) {
			removeFromComparison(pokemon.id);
		} else if (canAdd) {
			addToComparison(pokemon);
		}
	};

	const sizeClasses = {
		sm: "w-6 h-6 text-xs",
		md: "w-8 h-8 text-sm",
		lg: "w-10 h-10 text-base",
	};

	const iconSize = {
		sm: 12,
		md: 16,
		lg: 20,
	};

	return (
		<button
			className={`
        ${sizeClasses[size]}rounded-full flex items-center justify-center border-2 font-medium transition-all duration-200 ${
					isSelected
						? "border-green-500 bg-green-500 text-white hover:bg-green-600"
						: canAdd
							? "border-blue-500 bg-white text-blue-500 hover:bg-blue-50"
							: "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
				} ${className} `}
			disabled={!(canAdd || isSelected)}
			onClick={handleClick}
			title={
				isSelected
					? "Remove from comparison"
					: canAdd
						? "Add to comparison"
						: "Maximum 4 Pokemon can be compared"
			}
		>
			{isSelected ? (
				<Check size={iconSize[size]} />
			) : (
				<Plus size={iconSize[size]} />
			)}
		</button>
	);
}
