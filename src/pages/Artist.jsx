import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import SongList from "../components/SongList";
import Loading from "../components/Loading";
import { getArtistById, getSongByArtistId } from "../../api/api";

const Artist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [songsArrayFromArtist, setSongsArrayFromArtist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistData, songs] = await Promise.all([
          getArtistById(id),
          getSongByArtistId(id),
        ]);
        setArtist(artistData);
        setSongsArrayFromArtist(songs);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (!artist) return <h2>Artista não encontrado</h2>;

  const { name, banner } = artist;
  const randomIdFromArtist =
    songsArrayFromArtist.length > 0
      ? songsArrayFromArtist[Math.floor(Math.random() * songsArrayFromArtist.length)].id
      : null;

  return (
    <div className="artist">
      <div
        className="artist__header"
        style={{
          backgroundImage: `linear-gradient(to bottom, var(--_shade), var(--_shade)), url(${banner})`,
        }}
      >
        <h2 className="artist__title">{name}</h2>
      </div>

      <div className="artist__body">
        {songsArrayFromArtist.length > 0 ? (
          <>
            <h2>Populares</h2>
            <SongList songsArrayFromArtist={songsArrayFromArtist} />
          </>
        ) : (
          <div className="artist__isEmpty">
            <h1>Nenhuma música encontrada</h1>
          </div>
        )}
      </div>

      {randomIdFromArtist && (
        <Link to={`/song/${randomIdFromArtist}/fromArtist`} className="play-button">
          <button aria-label="Tocar músicas do artista">
            <FontAwesomeIcon className="single-item__icon single-item__icon--artist" icon={faCirclePlay} />
          </button>
        </Link>
      )}
    </div>
  );
};

export default Artist;
