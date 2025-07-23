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
	pokemon_v2_pokemonabilities?: PokemonAbilityRelation[];
	pokemon_v2_pokemonmoves?: PokemonMoveRelation[];
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

// Pokemon abilities
export interface PokemonAbilityRelation {
	is_hidden: boolean;
	pokemon_v2_ability: PokemonAbility;
}

export interface PokemonAbility {
	id: number;
	name: string;
	pokemon_v2_abilityeffecttexts: AbilityEffectText[];
}

export interface AbilityEffectText {
	effect: string;
	short_effect: string;
}

// Pokemon moves
export interface PokemonMoveRelation {
	level: number;
	pokemon_v2_move: PokemonMove;
}

export interface PokemonMove {
	id: number;
	name: string;
	power?: number;
	accuracy?: number;
	pp: number;
	pokemon_v2_type: PokemonType;
	pokemon_v2_movedamageclass: MoveDamageClass;
	pokemon_v2_moveeffecttexts?: MoveEffectText[];
}

export interface MoveDamageClass {
	name: string;
}

export interface MoveEffectText {
	effect: string;
	short_effect: string;
}

// Evolution chain
export interface EvolutionChain {
	pokemon_v2_pokemonspecies: EvolutionSpecies[];
}

export interface EvolutionSpecies {
	id: number;
	name: string;
	evolves_from_species_id?: number;
	pokemon_v2_pokemonevolutions: PokemonEvolution[];
	pokemon_v2_pokemons: EvolutionPokemon[];
}

export interface PokemonEvolution {
	min_level?: number;
	pokemon_v2_evolutiontrigger: EvolutionTrigger;
	pokemon_v2_item?: EvolutionItem;
}

export interface EvolutionTrigger {
	name: string;
}

export interface EvolutionItem {
	name: string;
}

export interface EvolutionPokemon {
	id: number;
	name: string;
	pokemon_v2_pokemonsprites: PokemonSprites[];
}

// Pokemon species (for description)
export interface PokemonSpecies {
	name: string;
	generation_id?: number;
	evolution_chain_id?: number;
	pokemon_v2_pokemonspeciesflavortexts: FlavorText[];
	pokemon_v2_evolutionchain?: EvolutionChain;
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
	pokemon_v2_pokemon_aggregate: {
		aggregate: {
			count: number;
		};
	};
}

// Pagination information for search results
export interface PaginationInfo {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	pageSize: number;
}

// Search Suggestion Types
export interface SearchSuggestion {
	id: number;
	name: string;
	pokemon_v2_pokemonsprites: PokemonSprites[];
}

export interface SearchSuggestionsResponse {
	pokemon_v2_pokemon: SearchSuggestion[];
}

export interface PopularPokemonResponse {
	pokemon_v2_pokemon: SearchSuggestion[];
}

// Search UI State Types
export interface SearchUIState {
	showSuggestions: boolean;
	selectedSuggestionIndex: number;
	inputFocused: boolean;
}

export interface SearchPaginationState {
	offset: number;
	limit: number;
	totalCount: number;
	currentResults: Pokemon[];
	hasMore: boolean;
}
