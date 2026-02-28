import { Link } from "react-router-dom";
import { playlists } from "../data/dummyData";
import "./Playlists.css";

function AddPlaylistButton({ onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      + New Playlist
    </button>
  );
}

function PlaylistCard({ playlist }) {
  return (
    <li className="playlist-card">
      <h2>
        <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
      </h2>
      <p>{playlist.description}</p>
      <span className="song-count">{playlist.songs.length} songs</span>
    </li>
  );
}

function Playlists() {
  const handleAddPlaylist = () => {
    alert("Add playlist functionality would go here");
  };

  return (
    <div id="playlists-page">
      <div className="page-header">
        <h1>Playlists</h1>
        <AddPlaylistButton onClick={handleAddPlaylist} />
      </div>
      <ul className="playlists-list">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
