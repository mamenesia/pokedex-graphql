// Base Pokemon type from GraphQL API
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  pokemon_v2_pokemonsprites: PokemonSprites[];
  pokemon_v2_pokemontypes: PokemonTypeRelation[];
  pokemon_v2_pokemonstats: PokemonStatRelation[];
  pokemon_v2_pokemonspecy?: PokemonSpecies;
}

// Pokemon sprites (images)
export interface PokemonSprites {
  sprites: string; // JSON string containing sprite URLs
}

// Parsed sprites object
export interface ParsedSprites {
  front_default?: string;
  front_shiny?: string;
  back_default?: string;
  back_shiny?: string;
  other?: {
    "official-artwork"?: {
      front_default?: string;
    };
    home?: {
      front_default?: string;
      front_shiny?: string;
    };
  };
}

// Pokemon type relation
export interface PokemonTypeRelation {
  pokemon_v2_type: PokemonType;
}

// Pokemon type
export interface PokemonType {
  id: number;
  name: string;
}

// Pokemon stat relation
export interface PokemonStatRelation {
  base_stat: number;
  pokemon_v2_stat: PokemonStat;
}

// Pokemon stat
export interface PokemonStat {
  name: string;
}

// Pokemon species (for description)
export interface PokemonSpecies {
  name: string;
  pokemon_v2_pokemonspeciesflavortexts: FlavorText[];
}

// Flavor text (description)
export interface FlavorText {
  flavor_text: string;
}

// Simplified Pokemon for display
export interface SimplePokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: Record<string, number>;
}

// GraphQL Query Response Types
export interface GetPokemonListResponse {
  pokemon_v2_pokemon: Pokemon[];
}

export interface GetPokemonByIdResponse {
  pokemon_v2_pokemon_by_pk: Pokemon;
}

export interface SearchPokemonResponse {
  pokemon_v2_pokemon: Pokemon[];
}
