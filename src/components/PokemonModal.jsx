import React from 'react';
import { fetchData } from '../utils/utils';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import '../styles/modal.css'; 

function PokemonModal({ url, onClose }) {
    const fetchAbilities = useCallback(async () => {
        const jsonResponse = await fetchData(url);
        return jsonResponse.abilities;
    }, [url]);
    
    const { data: abilities, error, isLoading } = useQuery({
        queryKey: ['abilities', url],
        queryFn: fetchAbilities,
    });

    if (isLoading) return <div className="cubeModal">Loading...</div>;
    if (error) return <div className="cubeModal">Error: {error.message}</div>;

    return (
        <div className="overlay" onClick={onClose}>
            <div className="cubeModal" onClick={(e) => e.stopPropagation()}>
                <h2>Abilities</h2>
                {abilities && abilities.length > 0 ? (
                    <ul>
                        {abilities.map((ability, index) => (
                            <li key={index}>{ability.ability.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No abilities found.</p>
                )}
                <button onClick={onClose} className="closeButton">Close</button>
            </div>
        </div>
    );
}

export default PokemonModal;
