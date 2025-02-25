import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { getArtistById } from '../../api/api.js';

const SingleItem = ({ id, name, image, artist, idPath, isArtist }) => {
  const [artistData, setArtistData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!artist) return;

      setIsLoading(true);
      try {
        const response = await getArtistById(artist);
        setArtistData(response?.id === artist ? response : null);
      } catch (error) {
        console.error("Erro ao buscar os dados do artista:", error);
        setArtistData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtist();
  }, [artist]);

  // Obtém o nome do artista ou exibe status de carregamento
  const getArtistName = () => {
    if (isArtist) return "Artista";
    if (isLoading) return "Carregando...";
    return artistData ? artistData.name : "Artista desconhecido";
  };

  return (
    <Link to={`${idPath}/${id}/${isArtist ? '' : 'all'}`} className="single-item">
      <div className="single-item__div-image-button">
        <div className={isArtist ? "single-item__div-image" : "single-item__div-image--song"}>
          <img
            className="single-item__image"
            src={image}
            alt={isArtist ? `Imagem do artista: ${name}` : `Capa da música: ${name}`}
          />
        </div>
        <FontAwesomeIcon className="single-item__icon" icon={faCirclePlay} />
      </div>
      <div className={isArtist ? "single-item__texts--artist" : "single-item__texts"}>
        <p className="single-item__title">{name}</p>
        <p className="single-item__type">{getArtistName()}</p>
      </div>
    </Link>
  );
};

export default SingleItem;
