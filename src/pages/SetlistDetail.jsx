import { useParams, Link } from "react-router-dom";
import { dummySetlists, dummyPlaylists } from "../data/dummyData";
import "./SetlistDetail.css";
import Modal from "../components/Modal";
import { useState } from "react";

function SetlistInfo({ setlist, playlist }) {
  return (
    <div className="setlist-info">
      <p>
        <strong>Venue:</strong> {setlist.venue}
      </p>
      <p>
        <strong>Date:</strong> {setlist.date}
      </p>
      <p>
        <strong>Source Playlist:</strong>{" "}
        <Link to={`/playlists/${setlist.playlistId}`}>{playlist?.name}</Link>
      </p>
    </div>
  );
}

function AddSongButton({ onClick }) {
  return (
    <button className="add-button" onClick={onClick}>
      + Add Song
    </button>
  );
}

function AddSongForm({ playlistSongs, onNewSong }) {
  const [songId, setSongId] = useState(
    playlistSongs.length > 0 ? playlistSongs[0].id : "",
  );
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!songId) return;
    onNewSong({ songId: Number(songId), notes });
    setSongId(playlistSongs.length > 0 ? playlistSongs[0].id : "");
    setNotes("");
  }

  if (playlistSongs.length === 0) {
    return <p>There are no songs in this playlist.</p>;
  }

  return (
    <form className="add-song-form" onSubmit={handleSubmit}>
      <label>
        Song
        <select
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          aria-label="Song"
        >
          {playlistSongs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title} - {song.artist}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter performance notes (optional)"
          aria-label="Notes"
        />
      </label>
      <button type="submit" className="submit-button">
        Add Song
      </button>
    </form>
  );
}

function SongCard({ song, index, notes, onDelete }) {
  return (
    <li className="song-card">
      <div className="song-number">{index + 1}</div>
      <div className="song-details">
        <h3 className="song-title">{song.title}</h3>
        <p className="song-artist">{song.artist}</p>
        {notes && <p className="song-notes">{notes}</p>}
      </div>
      <div className="song-metadata">
        <span className="song-duration">{song.duration}</span>
        <span className="song-bpm">{song.bpm} BPM</span>
        <span className="song-key">{song.key}</span>
      </div>
      <button className="delete-button" onClick={onDelete}>
        Delete
      </button>
    </li>
  );
}

function SetlistDetail() {
  const { id } = useParams();
  const initialSetlist = dummySetlists.find((s) => s.id === parseInt(id));
  const [setlist, setSetlist] = useState(initialSetlist);
  const [addSongOpen, setAddSongOpen] = useState(false);

  if (!setlist) {
    return (
      <div>
        <h2>Setlist Not Found</h2>
        <Link to="/setlists">Back to Setlists</Link>
      </div>
    );
  }

  const playlist = dummyPlaylists.find((p) => p.id === setlist.playlistId);

  const getSongDetails = (songId) => {
    if (!playlist) return null;
    return playlist.songs.find((s) => s.id === songId);
  };

  const handleOpenModal = () => {
    setAddSongOpen(true);
  };

  const handleCloseModal = () => {
    setAddSongOpen(false);
  };

  const addSong = (newItem) => {
    setSetlist({ ...setlist, songs: [...setlist.songs, newItem] });
    handleCloseModal();
  };

  const deleteSong = (songId) => {
    setSetlist({
      ...setlist,
      songs: setlist.songs.filter((item) => item.songId !== songId),
    });
  };

  return (
    <div id="setlist-detail-page">
      <Modal
        isOpen={addSongOpen}
        title="Add Song"
        onCloseRequested={handleCloseModal}
      >
        <AddSongForm playlistSongs={playlist.songs} onNewSong={addSong} />
      </Modal>
      <h1>{setlist.name}</h1>
      <p>{setlist.description}</p>

      <SetlistInfo setlist={setlist} playlist={playlist} />

      <div className="page-header">
        <h2>Songs ({setlist.songs.length})</h2>
        <AddSongButton onClick={handleOpenModal} />
      </div>

      <ul className="songs-list">
        {setlist.songs.map((item, index) => {
          const song = getSongDetails(item.songId);
          return song ? (
            <SongCard
              key={item.songId}
              song={song}
              index={index}
              notes={item.notes}
              onDelete={() => deleteSong(item.songId)}
            />
          ) : null;
        })}
      </ul>
    </div>
  );
}

export default SetlistDetail;
