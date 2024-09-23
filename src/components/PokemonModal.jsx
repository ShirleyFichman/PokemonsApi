import React from 'react';
import '../styles/modal.css'; // Ensure this path is correct based on your project structure

import { useQuery } from '@tanstack/react-query';

function PokemonModal({ url, onClose }) {
    const fetchAbilities = async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonResponse = await response.json();
        return jsonResponse.abilities;
    };

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
