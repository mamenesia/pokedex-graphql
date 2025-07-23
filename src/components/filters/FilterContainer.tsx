import { SlidersHorizontal } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/stores/search-store";
import GenerationFilter from "./GenerationFilter";
import TypeFilter from "./TypeFilter";

export default function FilterContainer() {
	const { hasActiveFilters, clearFilters } = useSearchStore();

	return (
		<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<SlidersHorizontal className="h-4 w-4" />
					<h2 className="font-medium text-md">Filters</h2>
				</div>
				{hasActiveFilters && (
					<Button
						className="h-8 text-xs"
						onClick={clearFilters}
						size="sm"
						variant="ghost"
					>
						Clear All
					</Button>
				)}
			</div>

			<TypeFilter />
			<GenerationFilter />
		</div>
	);
}
