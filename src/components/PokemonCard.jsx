import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PokemonModal from  './PokemonModal';
import { fetchData } from '../utils/utils';

function PokemonCard({ name, url }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchImage = async () => {
    const jsonResponse = await fetchData(url);
    return jsonResponse.sprites.front_default;
  };

  const { data: image, error, isLoading } = useQuery({
    queryKey: ['image', url], 
    queryFn: fetchImage,
  });

  if (isLoading) return <div>Loading Image...</div>;
  if (error) return <div>Error Displaying Image: {error.message}</div>;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <p>{name}</p>
        {image && <img src={image} alt={`${name} sprite`} />}
      </div>
      {isModalOpen && <PokemonModal url={url} onClose={handleCloseModal} />}
    </>
  );
}

export default PokemonCard;
