import React, { useEffect, useState } from 'react';
import Player from '../components/Player';
import { Link, useParams } from 'react-router-dom';
import { getArtistById, getSongById, getSongByArtistId, getSongs } from '../../api/api.js';
import Loading from '../components/Loading.jsx';

const Song = () => {
  const { id, type } = useParams();
  const [songObj, setSongObj] = useState(null);
  const [artistObj, setArtistObj] = useState(null);
  const [songsArray, setSongsArray] = useState([]);
  const [aleatoryPlaylist, setAleatoryPlaylist] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const songData = await getSongById(id);
        const artistData = await getArtistById(songData.artist);
        setSongObj(songData);
        setArtistObj(artistData);

        let songsList;
        if (type === "all") {
          if (!aleatoryPlaylist) {
            songsList = shuffleArray(await getSongs(Infinity));

            const selectedSongIndex = songsList.findIndex(song => song.id === id);
            if (selectedSongIndex !== -1) {
              const [selectedSong] = songsList.splice(selectedSongIndex, 1);
              songsList.unshift(selectedSong);
            }
            setAleatoryPlaylist(true);
          }
        } else if (type === "fromArtist") {
          songsList = await getSongByArtistId(songData.artist);
        }

        if (songsList) {
          setSongsArray(songsList);
          setCurrentSongIndex(songsList.findIndex(song => song.id === id));
        }
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchData();
    }
  }, [id, type, aleatoryPlaylist]);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const nextSong = () => {
    const id = songsArray[currentSongIndex + 1]?.id;
    setCurrentSongIndex(prevIndex => Math.min(prevIndex + 1, songsArray.length - 1));
    return id;
  };

  const previousSong = () => {
    const id = songsArray[currentSongIndex - 1]?.id;
    setCurrentSongIndex(prevIndex => Math.max(prevIndex - 1, 0));
    return id;
  };

  if (!songObj || !artistObj || loading) {
    return <Loading />;
  }

  const { image, name, duration, audio } = songsArray[currentSongIndex];

  return (
    <div className='song'>
      <div className="song__container">
        <div className="song__image-container">
          <img src={image} alt={`Imagem da música ${name}`} />
        </div>
      </div>

      <div className='song__bar'>
        <Link to={`/artist/${artistObj.id}`} className='song__artist-image'>
          <img width={75} height={75} src={artistObj.image} alt={`Imagem do artista ${artistObj.name}`} />
        </Link>

        <Player
          type={type}
          duration={duration}
          audio={audio}
          nextSong={nextSong}
          previousSong={previousSong}
          disablePrevious={currentSongIndex === 0}
          disabledNext={currentSongIndex === songsArray.length - 1}
        />

        <div className='song__description'>
          <p className='song__name'>{name}</p>
          <p>{artistObj.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;
