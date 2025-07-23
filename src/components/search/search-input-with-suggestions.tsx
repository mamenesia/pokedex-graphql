"use client";

import { useLazyQuery } from "@apollo/client";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { POKEBALL_PLACEHOLDER } from "@/data/constants/assets";
import {
	GET_POPULAR_POKEMON,
	GET_SEARCH_SUGGESTIONS,
} from "@/lib/graphql/queries";
import type {
	PopularPokemonResponse,
	SearchSuggestion,
	SearchSuggestionsResponse,
} from "@/lib/types/pokemon";
import { cn } from "@/lib/utils";
import { capitalizePokemonName, getPokemonImageUrl } from "@/lib/utils/pokemon";

interface SearchInputWithSuggestionsProps {
	onSearch: (query: string) => void;
	onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
	placeholder?: string;
	className?: string;
	debounceMs?: number;
}

export function SearchInputWithSuggestions({
	onSearch,
	onSuggestionSelect,
	placeholder = "Search Pokemon...",
	className,
	debounceMs = 300,
}: SearchInputWithSuggestionsProps) {
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	// Lazy queries for suggestions
	const [
		getSuggestions,
		{ data: suggestionsData, loading: suggestionsLoading },
	] = useLazyQuery<SearchSuggestionsResponse>(GET_SEARCH_SUGGESTIONS, {
		fetchPolicy: "cache-first",
	});

	const [getPopularPokemon, { data: popularData }] =
		useLazyQuery<PopularPokemonResponse>(GET_POPULAR_POKEMON, {
			fetchPolicy: "cache-first",
		});

	// Debounce the input value
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(inputValue);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [inputValue, debounceMs]);

	// Handle search when debounced value changes
	useEffect(() => {
		onSearch(debouncedValue);
	}, [debouncedValue, onSearch]);

	// Fetch suggestions when input changes
	useEffect(() => {
		if (inputValue.trim().length >= 2) {
			getSuggestions({
				variables: { name: `%${inputValue.trim()}%`, limit: 8 },
			});
		} else if (inputValue.trim().length === 0 && showSuggestions) {
			// Show popular Pokemon when input is empty but focused
			getPopularPokemon({ variables: { limit: 6 } });
		}
	}, [inputValue, getSuggestions, getPopularPokemon, showSuggestions]);

	// Update suggestions when data changes
	useEffect(() => {
		if (inputValue.trim().length >= 2 && suggestionsData) {
			setSuggestions(suggestionsData.pokemon_v2_pokemon);
		} else if (inputValue.trim().length === 0 && popularData) {
			setSuggestions(popularData.pokemon_v2_pokemon);
		} else {
			setSuggestions([]);
		}
	}, [suggestionsData, popularData, inputValue]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		setSelectedIndex(-1);
		setShowSuggestions(true);
	};

	const handleInputFocus = () => {
		setShowSuggestions(true);
		if (inputValue.trim().length === 0) {
			getPopularPokemon({ variables: { limit: 6 } });
		}
	};

	const handleInputBlur = () => {
		// Delay hiding suggestions to allow for clicks
		setTimeout(() => setShowSuggestions(false), 150);
	};

	const handleClear = () => {
		setInputValue("");
		setShowSuggestions(false);
		setSelectedIndex(-1);
		inputRef.current?.focus();
	};

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		const pokemonName = capitalizePokemonName(suggestion.name);
		setInputValue(pokemonName);
		setShowSuggestions(false);
		setSelectedIndex(-1);
		onSuggestionSelect?.(suggestion);
		onSearch(pokemonName);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions || suggestions.length === 0) {
			return;
		}

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1
				);
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && suggestions[selectedIndex]) {
					handleSuggestionClick(suggestions[selectedIndex]);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				inputRef.current?.blur();
				break;
			default:
				// Let other keys behave normally
				break;
		}
	};

	const getSuggestionTitle = () => {
		if (inputValue.trim().length >= 2) {
			return "Suggestions";
		}
		return "Popular Pokemon";
	};

	return (
		<div className={cn("relative", className)}>
			{/* Search Icon */}
			<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />

			{/* Search Input */}
			<input
				autoComplete="off"
				className={cn(
					"w-full rounded-lg border border-input py-2 pr-10 pl-10",
					"bg-background text-foreground placeholder:text-muted-foreground",
					"focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring",
					"transition-all duration-200"
				)}
				onBlur={handleInputBlur}
				onChange={handleInputChange}
				onFocus={handleInputFocus}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				type="text"
				value={inputValue}
			/>

			{/* Clear Button */}
			{inputValue && (
				<button
					className={cn(
						"-translate-y-1/2 absolute top-1/2 right-3 transform",
						"text-muted-foreground hover:text-foreground",
						"transition-colors duration-200"
					)}
					onClick={handleClear}
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			)}

			{/* Suggestions Dropdown */}
			{showSuggestions && (suggestions.length > 0 || suggestionsLoading) && (
				<div
					className={cn(
						"absolute top-full right-0 left-0 z-50 mt-1",
						"rounded-lg border border-input bg-background shadow-lg",
						"max-h-80 overflow-y-auto"
					)}
					ref={suggestionsRef}
				>
					{/* Suggestions Header */}
					<div className="border-input border-b px-3 py-2">
						<p className="font-medium text-muted-foreground text-sm">
							{getSuggestionTitle()}
						</p>
					</div>

					{/* Loading State */}
					{suggestionsLoading && (
						<div className="px-3 py-4 text-center">
							<div className="mx-auto mb-2 h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
							<p className="text-muted-foreground text-sm">
								Loading suggestions...
							</p>
						</div>
					)}

					{/* Suggestions List */}
					{!suggestionsLoading &&
						suggestions.map((suggestion, index) => {
							const imageUrl = getPokemonImageUrl(
								suggestion.pokemon_v2_pokemonsprites
							);
							const pokemonName = capitalizePokemonName(suggestion.name);

							return (
								<button
									className={cn(
										"flex w-full items-center space-x-3 px-3 py-2 text-left",
										"transition-colors duration-150 hover:bg-muted",
										selectedIndex === index && "bg-muted"
									)}
									key={suggestion.id}
									onClick={() => handleSuggestionClick(suggestion)}
									type="button"
								>
									{/* Pokemon Image */}
									<div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-muted">
										{imageUrl ? (
											<Image
												alt={pokemonName}
												blurDataURL={POKEBALL_PLACEHOLDER}
												className="h-full w-full object-cover"
												height={100}
												loading="lazy"
												placeholder="blur"
												src={imageUrl}
												width={100}
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-xs">
												?
											</div>
										)}
									</div>

									{/* Pokemon Info */}
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-foreground text-sm">
											{pokemonName}
										</p>
										<p className="text-muted-foreground text-xs">
											#{suggestion.id.toString().padStart(3, "0")}
										</p>
									</div>
								</button>
							);
						})}
				</div>
			)}
		</div>
	);
}
