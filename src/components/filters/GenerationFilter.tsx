import { X } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { POKEMON_GENERATIONS } from "@/data/constants/pokemon";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/search-store";

// Pokemon generations with corresponding regions

export default function GenerationFilter() {
	const { filters, addGenerationFilter, removeGenerationFilter } =
		useSearchStore();

	// Toggle a generation filter
	const toggleGenerationFilter = (generationId: number) => {
		if (filters.generations.includes(generationId)) {
			removeGenerationFilter(generationId);
		} else {
			addGenerationFilter(generationId);
		}
	};

	return (
		<div className="space-y-2">
			<h3 className="font-medium text-sm">Filter by Generation</h3>
			<div className="flex flex-wrap gap-2">
				{POKEMON_GENERATIONS.map((generation) => {
					const isSelected = filters.generations.includes(generation.id);

					return (
						<Badge
							className={cn(
								"cursor-pointer transition-all",
								isSelected
									? "bg-indigo-600 opacity-100 shadow-md"
									: "bg-indigo-400 opacity-60 hover:opacity-80"
							)}
							key={generation.id}
							onClick={() => toggleGenerationFilter(generation.id)}
							title={generation.region}
						>
							{generation.name}
							{isSelected && (
								<X className="ml-1 h-3 w-3" data-testid="x-icon" />
							)}
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
