"use client";

import { useQuery } from "@apollo/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { POKEBALL_PLACEHOLDER } from "@/data/constants/assets";
import { GET_POKEMON_LIST } from "@/lib/graphql/queries";
import type { GetPokemonListResponse } from "@/lib/types/pokemon";
import {
  capitalizePokemonName,
  formatPokemonId,
  getPokemonImageUrl,
} from "@/lib/utils/pokemon";

export default function HomePage() {
  const { loading, error, data, refetch } = useQuery<GetPokemonListResponse>(
    GET_POKEMON_LIST,
    {
      variables: { limit: 10, offset: 0 },
    }
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
          <p className="text-muted-foreground">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-bold text-2xl text-destructive">
            Error Loading Pokemon
          </h2>
          <p className="mb-4 text-muted-foreground">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 font-bold text-4xl">Pokedex GraphQL Test</h1>
        <p className="text-muted-foreground">
          Testing GraphQL connection with the Pokemon API
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.pokemon_v2_pokemon.map((pokemon) => {
          const imageUrl = getPokemonImageUrl(
            pokemon.pokemon_v2_pokemonsprites
          );
          const pokemonName = capitalizePokemonName(pokemon.name);
          const pokemonId = formatPokemonId(pokemon.id);

          return (
            <div
              className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-lg"
              key={pokemon.id}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 h-24 w-24">
                  <Image
                    alt={pokemonName}
                    className="object-contain"
                    height={100}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = POKEBALL_PLACEHOLDER;
                    }}
                    src={imageUrl}
                    width={100}
                  />
                </div>
                <h3 className="mb-2 font-semibold text-lg">{pokemonName}</h3>
                <p className="mb-2 text-muted-foreground text-sm">
                  #{pokemonId}
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {pokemon.pokemon_v2_pokemontypes.map((typeRelation) => (
                    <span
                      className="rounded-full bg-secondary px-2 py-1 text-secondary-foreground text-xs capitalize"
                      key={typeRelation.pokemon_v2_type.id}
                    >
                      {typeRelation.pokemon_v2_type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={() => refetch()}>Refresh Pokemon</Button>
      </div>
    </div>
  );
}
