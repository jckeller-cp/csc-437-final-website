import { useParams, Link } from "react-router-dom";
import { dummyPlaylists } from "../data/dummyData";
import "./PlaylistDetail.css";
import Modal from "../components/Modal";
import { useState, useRef } from "react";

function AddSongButton({ onClick }) {
  return (
    <button className="neutral-button" onClick={onClick}>
      + Add Song
    </button>
  );
}

function DeletePlaylistButton({ onClick }) {
  return (
    <button className="bad-button" onClick={onClick}>
      Delete Playlist
    </button>
  );
}

function AddSongForm({ onNewSong }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [errors, setErrors] = useState({});

  const titleRef = useRef(null);
  const artistRef = useRef(null);
  const durationRef = useRef(null);
  const bpmRef = useRef(null);
  const keyRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (title.trim() === "") newErrors.title = "Title is required.";
    if (artist.trim() === "") newErrors.artist = "Artist is required.";
    if (duration.trim() === "") newErrors.duration = "Duration is required.";
    if (bpm.trim() === "") {
      newErrors.bpm = "BPM is required.";
    } else if (Number(bpm) <= 0) {
      newErrors.bpm = "BPM must be a positive number.";
    }
    if (key.trim() === "") newErrors.key = "Key is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.title) titleRef.current.focus();
      else if (newErrors.artist) artistRef.current.focus();
      else if (newErrors.duration) durationRef.current.focus();
      else if (newErrors.bpm) bpmRef.current.focus();
      else if (newErrors.key) keyRef.current.focus();
      return;
    }
    onNewSong({ title, artist, duration, bpm: Number(bpm), key });
    setTitle("");
    setArtist("");
    setDuration("");
    setBpm("");
    setKey("");
  }

  return (
    <form className="add-song-form" onSubmit={handleSubmit} noValidate>
      {errors.title && (
        <p id="song-title-error" className="form-error">{errors.title}</p>
      )}
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
          ref={titleRef}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "song-title-error" : undefined}
        />
      </label>
      {errors.artist && (
        <p id="song-artist-error" className="form-error">{errors.artist}</p>
      )}
      <label>
        Artist
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
          ref={artistRef}
          aria-invalid={!!errors.artist}
          aria-describedby={errors.artist ? "song-artist-error" : undefined}
        />
      </label>
      {errors.duration && (
        <p id="song-duration-error" className="form-error">{errors.duration}</p>
      )}
      <label>
        Duration
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 3:45"
          ref={durationRef}
          aria-invalid={!!errors.duration}
          aria-describedby={errors.duration ? "song-duration-error" : undefined}
        />
      </label>
      {errors.bpm && (
        <p id="song-bpm-error" className="form-error">{errors.bpm}</p>
      )}
      <label>
        BPM
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="e.g. 120"
          min="1"
          ref={bpmRef}
          aria-invalid={!!errors.bpm}
          aria-describedby={errors.bpm ? "song-bpm-error" : undefined}
        />
      </label>
      {errors.key && (
        <p id="song-key-error" className="form-error">{errors.key}</p>
      )}
      <label>
        Key
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. C Major"
          ref={keyRef}
          aria-invalid={!!errors.key}
          aria-describedby={errors.key ? "song-key-error" : undefined}
        />
      </label>
      <button type="submit" className="submit-button">
        Add Song
      </button>
    </form>
  );
}

function SongCard({ song, index, onDelete }) {
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
      <button className="bad-button" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
}

function PlaylistDetail() {
  const { id } = useParams();
  const initialPlaylist = dummyPlaylists.find((p) => p.id === parseInt(id));
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [addSongOpen, setAddSongOpen] = useState(false);

  const handleOpenModal = () => {
    setAddSongOpen(true);
  };

  const handleCloseModal = () => {
    setAddSongOpen(false);
  };

  const deleteSong = (songId) => {
    setPlaylist({
      ...playlist,
      songs: playlist.songs.filter((s) => s.id !== songId),
    });
  };

  const addSong = (newSong) => {
    const newId =
      playlist.songs.length > 0
        ? playlist.songs[playlist.songs.length - 1].id + 1
        : 1;
    const songToAdd = { id: newId, ...newSong };
    setPlaylist({ ...playlist, songs: [...playlist.songs, songToAdd] });
    handleCloseModal();
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
      <Modal
        isOpen={addSongOpen}
        title="Add Song"
        onCloseRequested={handleCloseModal}
      >
        <AddSongForm onNewSong={addSong} />
      </Modal>
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      <DeletePlaylistButton onClick={() => {}} />

      <div className="page-header">
        <h2>Songs ({playlist.songs.length})</h2>
        <AddSongButton onClick={handleOpenModal} />
      </div>

      <ul className="songs-list">
        {playlist.songs.map((song, index) => (
          <SongCard
            key={song.id}
            song={song}
            index={index}
            onDelete={() => deleteSong(song.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export default PlaylistDetail;
