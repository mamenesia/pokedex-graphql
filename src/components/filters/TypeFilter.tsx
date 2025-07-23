import { X } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { POKEMON_TYPES } from "@/data/constants/pokemon";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/search-store";

export default function TypeFilter() {
	const { filters, addTypeFilter, removeTypeFilter } = useSearchStore();

	// Toggle a type filter
	const toggleTypeFilter = (typeName: string) => {
		if (filters.types.includes(typeName)) {
			removeTypeFilter(typeName);
		} else {
			addTypeFilter(typeName);
		}
	};

	return (
		<div className="space-y-2">
			<h3 className="font-medium text-sm">Filter by Type</h3>
			<div className="flex flex-wrap gap-2">
				{POKEMON_TYPES.map((type) => {
					const isSelected = filters.types.includes(type.name);

					return (
						<Badge
							className={cn(
								"cursor-pointer capitalize transition-all",
								type.color,
								isSelected
									? "opacity-100 shadow-md"
									: "opacity-60 hover:opacity-80"
							)}
							key={type.name}
							onClick={() => toggleTypeFilter(type.name)}
						>
							{type.name}
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
