import { Link } from "react-router-dom";
import { playlists } from "../data/dummyData";
import "./Playlists.css";

function Playlists() {
  const handleAddPlaylist = () => {
    alert("Add playlist functionality would go here");
  };

  return (
    <div id="playlists-page">
      <div className="page-header">
        <h1>Playlists</h1>
        <button className="add-button" onClick={handleAddPlaylist}>
          + New Playlist
        </button>
      </div>
      <ul className="playlists-list">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="playlist-card">
            <h2>
              <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
            </h2>
            <p>{playlist.description}</p>
            <span className="song-count">{playlist.songs.length} songs</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
