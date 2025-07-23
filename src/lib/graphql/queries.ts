import { gql } from "@apollo/client";

// Optimized query to get a list of Pokemon with essential information only (limited to first 9 generations)
export const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int = 20, $offset: Int = 0, $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }]) {
    pokemon_v2_pokemon(
      limit: $limit, 
      offset: $offset, 
      order_by: $orderBy,
      where: {
        pokemon_v2_pokemonspecy: {
          generation_id: { _lte: 9 }
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
          generation_id: { _lte: 9 }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Query to get a single Pokemon by ID with detailed information
export const GET_POKEMON_BY_ID = gql`
  query GetPokemonById($id: Int!) {
    pokemon_v2_pokemon_by_pk(id: $id) {
      id
      name
      height
      weight
      base_experience
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
      # Pokemon abilities
      pokemon_v2_pokemonabilities {
        is_hidden
        pokemon_v2_ability {
          id
          name
          pokemon_v2_abilityeffecttexts(
            where: { language_id: { _eq: 9 } }
            limit: 1
          ) {
            effect
            short_effect
          }
        }
      }
      # Pokemon moves (limit to recent level-up moves)
      pokemon_v2_pokemonmoves(
        where: { 
          pokemon_v2_movelearnmethod: { name: { _eq: "level-up" } }
          level: { _lte: 50 }
        }
        order_by: [{ level: asc }]
        limit: 20
      ) {
        level
        pokemon_v2_move {
          id
          name
          power
          accuracy
          pp
          pokemon_v2_type {
            name
          }
          pokemon_v2_movedamageclass {
            name
          }
        }
      }
      pokemon_v2_pokemonspecy {
        name
        evolution_chain_id
        pokemon_v2_pokemonspeciesflavortexts(
          where: { language_id: { _eq: 9 } }
          limit: 1
        ) {
          flavor_text
        }
        # Evolution chain data
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies {
            id
            name
            evolves_from_species_id
            pokemon_v2_pokemonevolutions {
              min_level
              pokemon_v2_evolutiontrigger {
                name
              }
              pokemon_v2_item {
                name
              }
            }
            pokemon_v2_pokemons(limit: 1) {
              id
              name
              pokemon_v2_pokemonsprites {
                sprites
              }
            }
          }
        }
      }
    }
  }
`;

// Query to get Pokemon filtered by types and/or generations
export const GET_POKEMON_BY_TYPES = gql`
  query GetPokemonByTypes(
    $limit: Int = 20, 
    $offset: Int = 0, 
    $types: [String!] = [],
    $generations: [Int!] = [],
    $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }]
  ) {
    pokemon_v2_pokemon(
      limit: $limit, 
      offset: $offset, 
      order_by: $orderBy,
      where: {
        pokemon_v2_pokemontypes: { 
          pokemon_v2_type: { 
            name: { _in: $types } 
          } 
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
        pokemon_v2_pokemontypes: { 
          pokemon_v2_type: { 
            name: { _in: $types } 
          } 
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Query to search Pokemon by name with pagination and filter support
export const SEARCH_POKEMON = gql`
  query SearchPokemon(
    $name: String!, 
    $limit: Int = 20, 
    $offset: Int = 0,
    $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }]
  ) {
    pokemon_v2_pokemon(
      limit: $limit,
      offset: $offset,
      order_by: $orderBy,
      where: {
        name: { _ilike: $name }
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
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat {
          id
          name
        }
      }
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
    # Get total count for pagination
    pokemon_v2_pokemon_aggregate(
      where: {
        name: { _ilike: $name }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Query to get total Pokemon count for default list pagination
export const GET_POKEMON_COUNT = gql`
  query GetPokemonCount {
    pokemon_v2_pokemon_aggregate {
      aggregate {
        count
      }
    }
  }
`;

// Query for search suggestions (lightweight - only names and IDs)
export const GET_SEARCH_SUGGESTIONS = gql`
  query GetSearchSuggestions($name: String!, $limit: Int = 8) {
    pokemon_v2_pokemon(
      where: { name: { _ilike: $name } }
      limit: $limit
      order_by: [{ id: asc }]
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

// Query for popular Pokemon (for empty state suggestions)
export const GET_POPULAR_POKEMON = gql`
  query GetPopularPokemon($limit: Int = 6) {
    pokemon_v2_pokemon(
      where: { id: { _lte: 151 } } # Original 151 Pokemon
      order_by: [{ id: asc }]
      limit: $limit
    ) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;
