"use client";

import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SortOption } from "@/stores/search-store";
import { useSearchStore } from "@/stores/search-store";

interface SortDropdownProps {
	className?: string;
}

const SORT_OPTIONS: Array<{
	value: SortOption;
	label: string;
	group: string;
}> = [
	// Name sorting
	{ value: "name-asc", label: "Name (A-Z)", group: "Name" },
	{ value: "name-desc", label: "Name (Z-A)", group: "Name" },

	// ID/Number sorting
	{ value: "id-asc", label: "Pokedex Number (Low to High)", group: "Number" },
	{ value: "id-desc", label: "Pokedex Number (High to Low)", group: "Number" },

	// Stats sorting
	{ value: "hp-desc", label: "HP (Highest First)", group: "Stats" },
	{ value: "hp-asc", label: "HP (Lowest First)", group: "Stats" },
	{ value: "attack-desc", label: "Attack (Highest First)", group: "Stats" },
	{ value: "attack-asc", label: "Attack (Lowest First)", group: "Stats" },
];

export function SortDropdown({ className }: SortDropdownProps) {
	const { sort, setSortBy } = useSearchStore();

	const currentSortOption = useMemo(
		() => SORT_OPTIONS.find((option) => option.value === sort.sortBy),
		[sort.sortBy]
	);

	const handleSortChange = (sortOption: SortOption) => {
		setSortBy(sortOption);
	};

	// Group options by category
	const groupedOptions = SORT_OPTIONS.reduce(
		(acc, option) => {
			if (!acc[option.group]) {
				acc[option.group] = [];
			}
			acc[option.group].push(option);
			return acc;
		},
		{} as Record<string, typeof SORT_OPTIONS>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className={className} variant="outline">
					<span className="mr-2">
						Sort by: {currentSortOption?.label || "Name (A-Z)"}
					</span>
					<ChevronDown className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel>Sort Pokemon</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{Object.entries(groupedOptions).map(([group, options], groupIndex) => (
					<div key={group}>
						{groupIndex > 0 && <DropdownMenuSeparator />}
						<DropdownMenuLabel className="px-2 py-1 text-muted-foreground text-xs">
							{group}
						</DropdownMenuLabel>
						{options.map((option) => (
							<DropdownMenuItem
								className={`cursor-pointer ${
									sort.sortBy === option.value ? "bg-accent" : ""
								}`}
								key={option.value}
								onClick={() => handleSortChange(option.value)}
							>
								{option.label}
								{sort.sortBy === option.value && (
									<span className="ml-auto text-xs">✓</span>
								)}
							</DropdownMenuItem>
						))}
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
