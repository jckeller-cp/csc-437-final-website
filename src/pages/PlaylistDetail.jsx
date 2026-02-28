import { useParams, Link } from "react-router-dom";
import { dummyPlaylists } from "../data/dummyData";
import "./PlaylistDetail.css";
import Modal from "../components/Modal";
import { useState } from "react";

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

  function handleSubmit(e) {
    e.preventDefault();
    if (
      title.trim() === "" ||
      artist.trim() === "" ||
      duration.trim() === "" ||
      bpm.trim() === "" ||
      key.trim() === ""
    ) {
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
    <form className="add-song-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter song title"
          aria-label="Song Title"
        />
      </label>
      <label>
        Artist
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          placeholder="Enter artist name"
          aria-label="Artist"
        />
      </label>
      <label>
        Duration
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          placeholder="e.g. 3:45"
          aria-label="Duration"
        />
      </label>
      <label>
        BPM
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          required
          placeholder="e.g. 120"
          aria-label="BPM"
          min="1"
        />
      </label>
      <label>
        Key
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
          placeholder="e.g. C Major"
          aria-label="Key"
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
