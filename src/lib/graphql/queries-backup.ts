import { gql } from "@apollo/client";

// Optimized query to get a list of Pokemon with essential information only (limited to first 9 generations)
export const GET_POKEMON_LIST = gql`
  query GetPokemonList($limit: Int = 20, $offset: Int = 0, $orderBy: [pokemon_order_by!] = [{ id: asc }]) {
    pokemon(
      limit: $limit, 
      offset: $offset, 
      order_by: $orderBy,
      where: {
        pokemonspecy: {
          generation_id: { _lte: 9 }
        }
      }
    ) {
      id
      name
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          id
          name
        }
      }
      # Only fetch first 4 stats for performance (HP, Attack, Defense, Sp. Attack)
      pokemonstats(limit: 4, order_by: { stat_id: asc }) {
        base_stat
        stat {
          name
        }
      }
      # Include generation data for display
      pokemonspecy {
        generation_id
      }
    }
    # Get total count for pagination
    pokemon_aggregate(
      where: {
        pokemonspecy: {
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
    pokemon_by_pk(id: $id) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        type {
          id
          name
        }
      }
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
      # Pokemon abilities
      pokemonabilities {
        is_hidden
        ability {
          id
          name
          abilityeffecttexts(
            where: { language_id: { _eq: 9 } }
            limit: 1
          ) {
            effect
            short_effect
          }
        }
      }
      # Pokemon moves (limit to recent level-up moves)
      pokemonmoves(
        where: { 
          movelearnmethod: { name: { _eq: "level-up" } }
          level: { _lte: 50 }
        }
        order_by: [{ level: asc }]
        limit: 20
      ) {
        level
        move {
          id
          name
          power
          accuracy
          pp
          type {
            name
          }
          movedamageclass {
            name
          }
          moveeffect {
            moveeffectproses(
              where: { language_id: { _eq: 9 } }
              limit: 1
            ) {
              short_effect
              effect
            }
          }
        }
      }
      pokemonspecy {
        name
        evolution_chain_id
        pokemonspeciesflavortexts(
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

// OPTIMIZED: Single consolidated query for all search/filter/sort operations
export const GET_POKEMON_OPTIMIZED = gql`
  query GetPokemonOptimized(
    $limit: Int = 20,
    $offset: Int = 0,
    $orderBy: [pokemon_v2_pokemon_order_by!] = [{ id: asc }],
    $searchTerm: String = "",
    $types: [String!] = [],
    $generations: [Int!] = [],
    $hasSearch: Boolean = false,
    $hasTypes: Boolean = false,
    $hasGenerations: Boolean = false
  ) {
    pokemon_v2_pokemon(
      limit: $limit,
      offset: $offset,
      order_by: $orderBy,
      where: {
        _and: [
          # Search condition - only apply if hasSearch is true
          {
            _or: [
              { _not: $hasSearch },
              { name: { _iregex: $searchTerm } },
              { id: { _eq: $searchTerm } }
            ]
          },
          # Type filtering - only apply if hasTypes is true
          {
            _or: [
              { _not: $hasTypes },
              {
                pokemon_v2_pokemontypes: {
                  pokemon_v2_type: { name: { _in: $types } }
                }
              }
            ]
          },
          # Generation filtering - only apply if hasGenerations is true
          {
            _or: [
              { _not: $hasGenerations },
              {
                pokemon_v2_pokemonspecy: {
                  generation_id: { _in: $generations }
                }
              }
            ]
          }
        ]
      }
    ) {
      id
      name
      # OPTIMIZED: Limit sprites to single entry for performance
      pokemon_v2_pokemonsprites(limit: 1) {
        sprites
      }
      # OPTIMIZED: Limit types to 2 (Pokemon can have max 2 types)
      pokemon_v2_pokemontypes(limit: 2, order_by: { slot: asc }) {
        pokemon_v2_type {
          id
          name
        }
      }
      # OPTIMIZED: Only fetch essential stats (HP, Attack, Defense, Sp.Attack, Sp.Defense, Speed)
      pokemon_v2_pokemonstats(
        where: { stat_id: { _in: [1, 2, 3, 4, 5, 6] } }
        order_by: { stat_id: asc }
      ) {
        base_stat
        pokemon_v2_stat {
          id
          name
        }
      }
      # Generation info for filtering
      pokemon_v2_pokemonspecy {
        generation_id
      }
    }
    
    # OPTIMIZED: Single aggregate query with same conditions for accurate pagination
    pokemon_v2_pokemon_aggregate(
      where: {
        _and: [
          {
            _or: [
              { _not: $hasSearch },
              { name: { _iregex: $searchTerm } },
              { id: { _eq: $searchTerm } }
            ]
          },
          {
            _or: [
              { _not: $hasTypes },
              {
                pokemon_v2_pokemontypes: {
                  pokemon_v2_type: { name: { _in: $types } }
                }
              }
            ]
          },
          {
            _or: [
              { _not: $hasGenerations },
              {
                pokemon_v2_pokemonspecy: {
                  generation_id: { _in: $generations }
                }
              }
            ]
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
