import { Link } from "react-router-dom";
import { dummySetlists, dummyPlaylists } from "../data/dummyData";
import "./Setlists.css";
import Modal from "../components/Modal";
import { useState } from "react";

function AddSetlistButton({ onClick }) {
  return (
    <button className="neutral-button" onClick={onClick}>
      + New Setlist
    </button>
  );
}

function AddSetlistForm({ onNewSetlist }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [playlistId, setPlaylistId] = useState(
    dummyPlaylists.length > 0 ? dummyPlaylists[0].id : "",
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (
      name.trim() === "" ||
      description.trim() === "" ||
      venue.trim() === "" ||
      date.trim() === ""
    ) {
      return;
    }
    onNewSetlist({
      name,
      description,
      venue,
      date,
      playlistId: Number(playlistId),
    });
    setName("");
    setDescription("");
    setVenue("");
    setDate("");
    setPlaylistId(dummyPlaylists.length > 0 ? dummyPlaylists[0].id : "");
  }

  return (
    <form className="add-setlist-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter setlist name"
          aria-label="Setlist Name"
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter setlist description"
          aria-label="Setlist Description"
        />
      </label>
      <label>
        Venue
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
          placeholder="Enter venue name"
          aria-label="Venue"
        />
      </label>
      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          aria-label="Date"
        />
      </label>
      <label>
        Playlist
        <select
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          aria-label="Playlist"
        >
          {dummyPlaylists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Create Setlist</button>
    </form>
  );
}

function SetlistCard({ setlist, playlistName }) {
  return (
    <div className="setlist-card">
      <h2>
        <Link to={`/setlists/${setlist.id}`}>{setlist.name}</Link>
      </h2>
      <p>{setlist.description}</p>
      <div className="setlist-meta">
        <span>📍 {setlist.venue}</span>
        <span>📅 {setlist.date}</span>
        <span>🎵 From: {playlistName}</span>
        <span>{setlist.songs.length} songs</span>
      </div>
    </div>
  );
}

function Setlists() {
  const [setlists, setSetlists] = useState(dummySetlists);
  const [addSetlistOpen, setAddSetlistOpen] = useState(false);

  const getPlaylistName = (playlistId) => {
    const playlist = dummyPlaylists.find((p) => p.id === playlistId);
    return playlist ? playlist.name : "Unknown Playlist";
  };

  const handleOpenModal = () => {
    setAddSetlistOpen(true);
  };

  const handleCloseModal = () => {
    setAddSetlistOpen(false);
  };

  const addSetlist = (newSetlist) => {
    const newId =
      setlists.length > 0 ? setlists[setlists.length - 1].id + 1 : 1;
    const setlistToAdd = { id: newId, songs: [], ...newSetlist };
    setSetlists([...setlists, setlistToAdd]);
    handleCloseModal();
  };

  return (
    <div id="setlists-page">
      <Modal
        isOpen={addSetlistOpen}
        title="New Setlist"
        onCloseRequested={handleCloseModal}
      >
        <AddSetlistForm onNewSetlist={addSetlist} />
      </Modal>
      <div className="page-header">
        <h1>Setlists</h1>
        <AddSetlistButton onClick={handleOpenModal} />
      </div>

      <div className="setlists-list">
        {setlists.map((setlist) => (
          <SetlistCard
            key={setlist.id}
            setlist={setlist}
            playlistName={getPlaylistName(setlist.playlistId)}
          />
        ))}
      </div>
    </div>
  );
}

export default Setlists;
