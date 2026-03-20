import { Link } from "react-router-dom";
import "./Playlists.css";
import Modal from "../components/Modal";
import { useState, useRef, useEffect, useTransition } from "react";

function AddPlaylistButton({ onClick }) {
  return (
    <button className="neutral-button" onClick={onClick}>
      + New Playlist
    </button>
  );
}

function AddPlaylistForm({ onNewPlaylist, submitError }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (name.trim() === "") newErrors.name = "Name is required.";
    if (description.trim() === "")
      newErrors.description = "Description is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.description) descriptionRef.current.focus();
      return;
    }
    startTransition(async () => {
      await onNewPlaylist({ name, description });
      setName("");
      setDescription("");
    });
  }

  return (
    <form className="add-playlist-form" onSubmit={handleSubmit} noValidate>
      {submitError && <p className="form-error">{submitError}</p>}
      {errors.name && (
        <p id="playlist-name-error" className="form-error">
          {errors.name}
        </p>
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
          disabled={isPending}
        />
      </label>
      {errors.description && (
        <p id="playlist-description-error" className="form-error">
          {errors.description}
        </p>
      )}
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter playlist description"
          ref={descriptionRef}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "playlist-description-error" : undefined
          }
          disabled={isPending}
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Playlist"}
      </button>
    </form>
  );
}

function PlaylistCard({ playlist }) {
  return (
    <li className="playlist-card">
      <h2>
        <Link to={`/playlists/${playlist._id}`}>{playlist.name}</Link>
      </h2>
      <p>{playlist.description}</p>
      <span className="song-count">{playlist.songs.length} songs</span>
    </li>
  );
}

function Playlists({ authToken }) {
  const [playlists, setPlaylists] = useState(null);
  const [addPlaylistOpen, setAddPlaylistOpen] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetch("/api/playlists", {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load playlists");
        return res.json();
      })
      .then((data) => setPlaylists(data))
      .catch((err) => setError(err.message));
  }, [authToken]);

  const handleOpenModal = () => {
    setSubmitError(null);
    setAddPlaylistOpen(true);
  };

  const handleCloseModal = () => {
    setAddPlaylistOpen(false);
  };

  const addPlaylist = ({ name, description }) => {
    setSubmitError(null);
    return fetch("/api/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create playlist");
        return res.json();
      })
      .then((created) => {
        setPlaylists((prev) => [...prev, created]);
        handleCloseModal();
      })
      .catch((err) => setSubmitError(err.message));
  };

  if (error) {
    return (
      <div className="status-message error">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <div id="playlists-page">
      <Modal
        isOpen={addPlaylistOpen}
        title="New Playlist"
        onCloseRequested={handleCloseModal}
      >
        <AddPlaylistForm
          onNewPlaylist={addPlaylist}
          submitError={submitError}
        />
      </Modal>
      <div className="page-header">
        <h1>Playlists</h1>
        <AddPlaylistButton onClick={handleOpenModal} />
      </div>
      {playlists === null ? (
        <p className="status-message">Loading playlists...</p>
      ) : (
        <ul className="playlists-list">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Playlists;
