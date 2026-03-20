import { useParams, Link, useNavigate } from "react-router-dom";
import "./SetlistDetail.css";
import Modal from "../components/Modal";
import { useState, useEffect, useTransition } from "react";

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
    <button className="neutral-button" onClick={onClick}>
      + Add Song
    </button>
  );
}

function DeleteSetlistButton({ onClick, isDeleting }) {
  return (
    <button className="bad-button" onClick={onClick} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete Setlist"}
    </button>
  );
}

function AddSongForm({ playlistSongs, onNewSong, isPending }) {
  const [songIndex, setSongIndex] = useState(
    playlistSongs.length > 0 ? "0" : "",
  );
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (songIndex === "") return;
    onNewSong({ songIndex: Number(songIndex), notes });
    setSongIndex(playlistSongs.length > 0 ? "0" : "");
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
          value={songIndex}
          onChange={(e) => setSongIndex(e.target.value)}
          aria-label="Song"
          disabled={isPending}
        >
          {playlistSongs.map((song, index) => (
            <option key={index} value={index}>
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
          disabled={isPending}
        />
      </label>
      <button type="submit" className="submit-button" disabled={isPending}>
        {isPending ? "Adding..." : "Add Song"}
      </button>
    </form>
  );
}

function SongCard({ song, index, notes, onDelete, isDeleting }) {
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
      <button className="bad-button" onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
}

function SetlistDetail({ authToken }) {
  const { setlistId } = useParams();
  const [setlist, setSetlist] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [addSongOpen, setAddSongOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [isDeletingSetlist, setIsDeletingSetlist] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/setlists/${setlistId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => (res.ok ? res.json() : false))
      .then((data) => {
        setSetlist(data);
        if (data && data.playlistId) {
          fetch(`/api/playlists/${data.playlistId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
            .then((res) => (res.ok ? res.json() : null))
            .then((playlistData) => setPlaylist(playlistData));
        }
      });
  }, [setlistId, authToken]);

  const patchSongs = (updatedSongs) => {
    return fetch(`/api/setlists/${setlistId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ songs: updatedSongs }),
    }).then((res) => {
      if (res.ok) setSetlist((prev) => ({ ...prev, songs: updatedSongs }));
    });
  };

  const handleOpenModal = () => setAddSongOpen(true);
  const handleCloseModal = () => setAddSongOpen(false);

  const addSong = (newItem) => {
    startTransition(async () => {
      await patchSongs([...setlist.songs, newItem]);
      handleCloseModal();
    });
  };

  const deleteSong = (index) => {
    setDeletingIndex(index);
    const updatedSongs = setlist.songs.filter((_, i) => i !== index);
    patchSongs(updatedSongs).finally(() => setDeletingIndex(null));
  };

  const deleteSetlist = () => {
    setIsDeletingSetlist(true);
    fetch(`/api/setlists/${setlistId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    }).then(() => navigate("/setlists"));
  };

  if (setlist === null) {
    return <p>Loading setlist...</p>;
  }

  if (setlist === false) {
    return (
      <div>
        <h2>Setlist Not Found</h2>
        <Link to="/setlists">Back to Setlists</Link>
      </div>
    );
  }

  const playlistSongs = playlist ? playlist.songs : [];

  return (
    <div id="setlist-detail-page">
      <Modal
        isOpen={addSongOpen}
        title="Add Song"
        onCloseRequested={handleCloseModal}
      >
        <AddSongForm
          playlistSongs={playlistSongs}
          onNewSong={addSong}
          isPending={isPending}
        />
      </Modal>
      <h1>{setlist.name}</h1>
      <p>{setlist.description}</p>

      <SetlistInfo setlist={setlist} playlist={playlist} />

      <DeleteSetlistButton
        onClick={deleteSetlist}
        isDeleting={isDeletingSetlist}
      />

      <div className="page-header">
        <h2>Songs ({setlist.songs.length})</h2>
        <AddSongButton onClick={handleOpenModal} />
      </div>

      <ul className="songs-list">
        {setlist.songs.map((item, index) => {
          const song = playlistSongs[item.songIndex];
          return song ? (
            <SongCard
              key={index}
              song={song}
              index={index}
              notes={item.notes}
              onDelete={() => deleteSong(index)}
              isDeleting={deletingIndex === index}
            />
          ) : null;
        })}
      </ul>
    </div>
  );
}

export default SetlistDetail;
