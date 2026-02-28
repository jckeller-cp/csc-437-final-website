import { useParams, Link } from "react-router-dom";
import { dummyPlaylists } from "../data/dummyData";
import "./PlaylistDetail.css";

function AddSongButton({ onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      + Add Song
    </button>
  );
}

function SongCard({ song, index }) {
  return (
    <li className="song-card">
      <div className="song-number">{index + 1}</div>
      <div className="song-details">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">{song.artist}</p>
      </div>
      <div className="song-metadata">
        <span className="song-duration">{song.duration}</span>
        <span className="song-bpm">{song.bpm} BPM</span>
        <span className="song-key">{song.key}</span>
      </div>
    </li>
  );
}

function PlaylistDetail() {
  const { id } = useParams();
  const playlist = dummyPlaylists.find((p) => p.id === parseInt(id));

  const handleAddSong = () => {
    alert("Add song functionality would go here");
  };

  if (!playlist) {
    return (
      <div>
        <h2>Playlist Not Found</h2>
        <Link to="/playlists">Back to Playlists</Link>
      </div>
    );
  }

  return (
    <div id="playlist-detail-page">
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      <div className="page-header">
        <h2>Songs ({playlist.songs.length})</h2>
        <AddSongButton onClick={handleAddSong} />
      </div>

      <ul className="songs-list">
        {playlist.songs.map((song, index) => (
          <SongCard key={song.id} song={song} index={index} />
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDetail;
