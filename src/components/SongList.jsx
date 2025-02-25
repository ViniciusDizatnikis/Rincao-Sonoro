import React, { useState } from 'react';
import SongItem from '../components/SongItem';

const SongList = ({ songsArrayFromArtist }) => {
  const [items, setItems] = useState(5);

  return (
    <div className="song-list">
      {songsArrayFromArtist
        .filter((_, index) => index < items)
        .map((currentSongObj, index) => (
          <SongItem key={currentSongObj.id} index={index} {...currentSongObj} />
        ))}

      {songsArrayFromArtist.length > 5 && items < songsArrayFromArtist.length && (
        <p className="song-list__see-more" onClick={() => setItems(items + 5)}>
          Ver mais
        </p>
      )}
    </div>
  );
};

export default SongList;
