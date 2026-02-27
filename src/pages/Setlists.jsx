import { Link } from "react-router-dom";
import { setlists, playlists } from "../data/dummyData";
import "./Setlists.css";

function Setlists() {
  const getPlaylistName = (playlistId) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    return playlist ? playlist.name : "Unknown Playlist";
  };

  const handleAddSetlist = () => {
    alert("Add setlist functionality would go here");
  };

  return (
    <div id="setlists-page">
      <div className="page-header">
        <h1>Setlists</h1>
        <button className="add-button" onClick={handleAddSetlist}>
          + New Setlist
        </button>
      </div>
      <div className="setlists-list">
        {setlists.map((setlist) => (
          <div key={setlist.id} className="setlist-card">
            <h2>
              <Link to={`/setlists/${setlist.id}`}>{setlist.name}</Link>
            </h2>
            <p>{setlist.description}</p>
            <div className="setlist-meta">
              <span>📍 {setlist.venue}</span>
              <span>📅 {setlist.date}</span>
              <span>🎵 From: {getPlaylistName(setlist.playlistId)}</span>
              <span>{setlist.songs.length} songs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Setlists;
