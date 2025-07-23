import { gql } from "@apollo/client";

// Query to get ALL Pokemon with stats for client-side stat-based sorting
// This is needed because GraphQL stat-specific sorting is complex and unreliable
export const GET_ALL_POKEMON_FOR_STATS = gql`
  query GetAllPokemonForStats {
    pokemon_v2_pokemon(order_by: { id: asc }) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      # Fetch all stats for proper sorting
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      # Include generation data for display
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
  }
`;

// Query to get ALL Pokemon with stats filtered by types for stat-based sorting
export const GET_ALL_POKEMON_BY_TYPES_FOR_STATS = gql`
  query GetAllPokemonByTypesForStats($types: [String!] = []) {
    pokemon_v2_pokemon(
      where: {
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _in: $types } }
        }
      }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
  }
`;

// Query to get ALL Pokemon with stats filtered by generations for stat-based sorting
export const GET_ALL_POKEMON_BY_GENERATIONS_FOR_STATS = gql`
  query GetAllPokemonByGenerationsForStats($generations: [Int!] = []) {
    pokemon_v2_pokemon(
      where: {
        pokemon_v2_pokemonspecy: { generation_id: { _in: $generations } }
      }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
  }
`;

// Query to get ALL Pokemon with stats filtered by both types and generations for stat-based sorting
export const GET_ALL_FILTERED_POKEMON_FOR_STATS = gql`
  query GetAllFilteredPokemonForStats(
    $types: [String!] = []
    $generations: [Int!] = []
  ) {
    pokemon_v2_pokemon(
      where: {
        _and: [
          {
            pokemon_v2_pokemontypes: {
              pokemon_v2_type: { name: { _in: $types } }
            }
          }
          {
            pokemon_v2_pokemonspecy: { generation_id: { _in: $generations } }
          }
        ]
      }
      order_by: { id: asc }
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          id
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
  }
`;
