import { gql } from "@apollo/client";

// Query to get Pokemon filtered by generations only
export const GET_POKEMON_BY_GENERATIONS = gql`
  query GetPokemonByGenerations(
    $limit: Int = 20, 
    $offset: Int = 0, 
    $generations: [Int!],
    $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }]
  ) {
    pokemon_v2_pokemon(
      limit: $limit, 
      offset: $offset, 
      order_by: $orderBy,
      where: {
        pokemon_v2_pokemonspecy: { 
          generation_id: { _in: $generations }
        }
      }
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
      # Only fetch first 4 stats for performance (HP, Attack, Defense, Sp. Attack)
      pokemon_v2_pokemonstats(limit: 4, order_by: { stat_id: asc }) {
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
    # Get total count for pagination
    pokemon_v2_pokemon_aggregate(
      where: {
        pokemon_v2_pokemonspecy: { 
          generation_id: { _in: $generations }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Query to get Pokemon filtered by both types and generations
export const GET_FILTERED_POKEMON_LIST = gql`
  query GetFilteredPokemonList(
    $limit: Int = 20, 
    $offset: Int = 0, 
    $types: [String!], 
    $generations: [Int!],
    $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }]
  ) {
    pokemon_v2_pokemon(
      limit: $limit, 
      offset: $offset, 
      order_by: $orderBy,
      where: {
        _and: [
          {
            pokemon_v2_pokemontypes: { 
              pokemon_v2_type: { 
                name: { _in: $types } 
              } 
            }
          },
          {
            pokemon_v2_pokemonspecy: { 
              generation_id: { _in: $generations }
            }
          }
        ]
      }
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
      # Only fetch first 4 stats for performance (HP, Attack, Defense, Sp. Attack)
      pokemon_v2_pokemonstats(limit: 4, order_by: { stat_id: asc }) {
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
    # Get total count for pagination
    pokemon_v2_pokemon_aggregate(
      where: {
        _and: [
          {
            pokemon_v2_pokemontypes: { 
              pokemon_v2_type: { 
                name: { _in: $types } 
              } 
            }
          },
          {
            pokemon_v2_pokemonspecy: { 
              generation_id: { _in: $generations }
            }
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
