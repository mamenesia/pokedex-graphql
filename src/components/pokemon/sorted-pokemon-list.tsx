"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { ErrorMessage } from "@/components/ui/error-message";
import { PokemonCardSkeleton } from "@/components/ui/pokemon-card-skeleton";
import type { Pokemon } from "@/lib/types/pokemon";
import { sortPokemon } from "@/lib/utils/sorting";
import { useSearchStore } from "@/stores/search-store";

interface SortedPokemonListProps {
	pokemon: Pokemon[];
	loading: boolean;
	error: string | null;
}

export function SortedPokemonList({
	pokemon,
	loading,
	error,
}: SortedPokemonListProps) {
	const router = useRouter();
	const { sort } = useSearchStore();

	const handlePokemonClick = (pokemonItem: Pokemon) => {
		router.push(`/pokemon/${pokemonItem.id}`);
	};

	// Hybrid sorting approach:
	// - Server-side sorting for name/ID (handled by hook)
	// - Client-side sorting for HP/Attack stats (handled here)
	const sortedPokemon = useMemo(() => {
		// Check if this is a stat-based sort (HP or Attack)
		const isStatSort =
			sort.sortBy.includes("hp") || sort.sortBy.includes("attack");

		if (isStatSort) {
			// Use client-side sorting for stat-based sorts
			return sortPokemon(pokemon, sort.sortBy);
		}

		// For name/ID sorts, use server-side sorted data from hook
		return pokemon;
	}, [pokemon, sort.sortBy]);

	if (loading) {
		return <PokemonCardSkeleton count={12} />;
	}

	if (error) {
		return (
			<div className="py-8">
				<ErrorMessage message={error} />
			</div>
		);
	}

	return (
		<PokemonGrid
			loading={loading}
			onPokemonClick={handlePokemonClick}
			pokemon={sortedPokemon}
		/>
	);
}
