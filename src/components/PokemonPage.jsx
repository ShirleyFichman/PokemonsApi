import React from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonCard from './PokemonCard';
import './pokemonpage.css'
import { fetchData } from '../utils/utils';

function PokemonPage() {
    const URL = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'

    const fetchPokemons = async () => {
        return await fetchData(URL);
    };

    const { data, error, isLoading } = useQuery({
        queryKey: ['pokemons'],
        queryFn: fetchPokemons,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div >
            <h1>Pokemon Page</h1>
            <div className='grid'>
                {data?.results.map((pokemon) => (
                    <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
                ))}
            </div>
        </div>
    );
}

export default PokemonPage