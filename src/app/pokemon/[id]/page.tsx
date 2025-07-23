/** biome-ignore-all lint/nursery/useParseIntRadix: <explanation> */
"use client";

import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { PokemonDetailCard } from "@/components/pokemon/pokemon-detail-card";
import { BackButton } from "@/components/ui/back-button";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GET_POKEMON_BY_ID } from "@/lib/graphql/queries";

export default function PokemonDetailPage() {
	const params = useParams();
	const pokemonId = Number.parseInt(params.id as string);

	const { data, loading, error } = useQuery(GET_POKEMON_BY_ID, {
		variables: { id: pokemonId },
		skip: !pokemonId || Number.isNaN(pokemonId),
	});

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<BackButton />
				<div className="flex min-h-[400px] items-center justify-center">
					<LoadingSpinner size="large" />
				</div>
			</div>
		);
	}

	if (error || !data?.pokemon_v2_pokemon_by_pk) {
		return (
			<div className="container mx-auto px-4 py-8">
				<BackButton />
				<ErrorMessage
					message={
						error?.message || "The Pokemon you're looking for doesn't exist."
					}
					title="Pokemon Not Found"
				/>
			</div>
		);
	}

	const pokemon = data.pokemon_v2_pokemon_by_pk;

	return (
		<div className="container mx-auto px-4 py-8">
			<BackButton />
			<PokemonDetailCard pokemon={pokemon} />
		</div>
	);
}
