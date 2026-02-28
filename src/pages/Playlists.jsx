import { Link } from "react-router-dom";
import { dummyPlaylists } from "../data/dummyData";
import "./Playlists.css";
import Modal from "../components/Modal";
import { useState, useRef } from "react";

function AddPlaylistButton({ onClick }) {
  return (
    <button className="neutral-button" onClick={onClick}>
      + New Playlist
    </button>
  );
}

function AddPlaylistForm({ onNewPlaylist }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (name.trim() === "") newErrors.name = "Name is required.";
    if (description.trim() === "") newErrors.description = "Description is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.description) descriptionRef.current.focus();
      return;
    }
    onNewPlaylist({ name, description });
    setName("");
    setDescription("");
  }

  return (
    <form className="add-playlist-form" onSubmit={handleSubmit} noValidate>
      {errors.name && (
        <p id="playlist-name-error" className="form-error">{errors.name}</p>
      )}
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter playlist name"
          ref={nameRef}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "playlist-name-error" : undefined}
        />
      </label>
      {errors.description && (
        <p id="playlist-description-error" className="form-error">{errors.description}</p>
      )}
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter playlist description"
          ref={descriptionRef}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "playlist-description-error" : undefined}
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
