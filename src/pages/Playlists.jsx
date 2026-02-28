import { Link } from "react-router-dom";
import { dummyPlaylists } from "../data/dummyData";
import "./Playlists.css";
import Modal from "../components/Modal";
import { useState } from "react";

function AddPlaylistButton({ onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      + New Playlist
    </button>
  );
}

function AddPlaylistForm({ onNewPlaylist }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit() {
    if (name.trim() === "" || description.trim() === "") {
      return;
    }
    onNewPlaylist({ name, description });
    setName("");
    setDescription("");
  }

  return (
    <form className="add-playlist-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter playlist name"
          aria-label="Playlist Name"
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter playlist description"
          aria-label="Playlist Description"
        />
      </label>
      <button type="submit">Create Playlist</button>
    </form>
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
  const [playlists, setPlaylists] = useState(dummyPlaylists);
  const [addPlaylistOpen, setAddPlaylistOpen] = useState(false);

  const handleOpenModal = () => {
    setAddPlaylistOpen(true);
  };

  const handleCloseModal = () => {
    setAddPlaylistOpen(false);
  };

  const addPlaylist = (newPlaylist) => {
    const newId =
      playlists.length > 0 ? playlists[playlists.length - 1].id + 1 : 1;
    const playlistToAdd = { id: newId, songs: [], ...newPlaylist };
    setPlaylists([...playlists, playlistToAdd]);
    handleCloseModal();
  };

  return (
    <div id="playlists-page">
      <Modal
        isOpen={addPlaylistOpen}
        title="New Playlist"
        onCloseRequested={handleCloseModal}
      >
        <AddPlaylistForm onNewPlaylist={addPlaylist} />
      </Modal>
      <div className="page-header">
        <h1>Playlists</h1>
        <AddPlaylistButton onClick={handleOpenModal} />
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
