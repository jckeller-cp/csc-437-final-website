import { Link } from "react-router-dom";
import { dummySetlists, dummyPlaylists } from "../data/dummyData";
import "./Setlists.css";
import { useState } from "react";

function AddSetlistButton({ onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      + New Setlist
    </button>
  );
}

function SetlistCard({ setlist, playlistName }) {
  return (
    <div className="setlist-card">
      <h2>
        <Link to={`/setlists/${setlist.id}`}>{setlist.name}</Link>
      </h2>
      <p>{setlist.description}</p>
      <div className="setlist-meta">
        <span>📍 {setlist.venue}</span>
        <span>📅 {setlist.date}</span>
        <span>🎵 From: {playlistName}</span>
        <span>{setlist.songs.length} songs</span>
      </div>
    </div>
  );
}

function Setlists() {
  const [setlists, setSetlists] = useState(dummySetlists);

  const getPlaylistName = (playlistId) => {
    const playlist = dummyPlaylists.find((p) => p.id === playlistId);
    return playlist ? playlist.name : "Unknown Playlist";
  };

  const handleAddSetlist = () => {
    alert("Add setlist functionality would go here");
  };

  return (
    <div id="setlists-page">
      <div className="page-header">
        <h1>Setlists</h1>
        <AddSetlistButton onClick={handleAddSetlist} />
      </div>

      <div className="setlists-list">
        {setlists.map((setlist) => (
          <SetlistCard
            key={setlist.id}
            setlist={setlist}
            playlistName={getPlaylistName(setlist.playlistId)}
          />
        ))}
      </div>
    </div>
  );
}

export default Setlists;
