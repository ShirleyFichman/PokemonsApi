import React, { useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import PokemonCard from './PokemonCard';
import { fetchData } from '../utils/utils';
import '../styles/pokemonpage.css'; 

function PokemonPage() {
    const LIMIT = 50;
    const URL = 'https://pokeapi.co/api/v2/pokemon';

    const fetchPokemons = useCallback(async ({ pageParam = 0 }) => {
        const response = await fetchData(`${URL}?limit=${LIMIT}&offset=${pageParam}`);
        return {
            results: response.results,
            nextOffset: pageParam + LIMIT,
            hasNextPage: response.next !== null,
        };
    }, []);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['pokemons'],
        queryFn: fetchPokemons,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextOffset : undefined,
    });

    const allPokemon = data?.pages.flatMap(page => page.results) || [];
    const numRows = Math.ceil(allPokemon.length / 3); // Calculate number of rows based on 3 items per row
    const parentRef = useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: numRows,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 120,
    });

    const handleScroll = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Pokemon Page</h1>
            <div
                ref={parentRef}
                style={{ height: '600px', overflowY: 'auto' }}
                onScroll={handleScroll}
            >
                <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const startIndex = virtualRow.index * 3;
                        const pokemonInRow = allPokemon.slice(startIndex, startIndex + 3);

                        return (
                            <div
                                key={virtualRow.key}
                                ref={virtualRow.measureRef}
                                className="grid"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {pokemonInRow.map(pokemon => (
                                    <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
            {isFetchingNextPage && <div>Loading more Pokémon...</div>}
        </div>
    );
}

export default PokemonPage;
