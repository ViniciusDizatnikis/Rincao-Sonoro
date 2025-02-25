import React, { useEffect, useState } from 'react';
import ItemList from './ItemList';
import { getArtists, getSongs } from '../../api/api.js';
import Loading from './Loading.jsx';

// Função para embaralhar um array
const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Main = ({ type }) => {
    const [artistArray, setArtistArray] = useState([]);
    const [songsArray, setSongsArray] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const artists = await getArtists(Infinity);
                const songs = await getSongs(Infinity);

                setArtistArray(shuffleArray(artists));
                setSongsArray(shuffleArray(songs));
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type]);

    if (!artistArray || !songsArray || loading) {
        return <Loading />;
    }

    return (
        <div className="main">
            {/* Artistas */}
            {(type === "artists" || type === undefined) && (
                <ItemList
                    title="Artistas"
                    items={6}
                    itemsArray={artistArray}
                    path="/artists"
                    idPath="/artist"
                />
            )}

            {/* Músicas */}
            {(type === "songs" || type === undefined) && (
                <ItemList
                    title="Músicas"
                    items={20}
                    itemsArray={songsArray}
                    path="/songs"
                    idPath="/song"
                />
            )}
            
        </div>
    );
};

export default Main;
