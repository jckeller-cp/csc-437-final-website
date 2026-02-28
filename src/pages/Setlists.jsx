import { Link } from "react-router-dom";
import { dummySetlists, dummyPlaylists } from "../data/dummyData";
import "./Setlists.css";
import Modal from "../components/Modal";
import { useState, useRef } from "react";

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
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const venueRef = useRef(null);
  const dateRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (name.trim() === "") newErrors.name = "Name is required.";
    if (description.trim() === "") newErrors.description = "Description is required.";
    if (venue.trim() === "") newErrors.venue = "Venue is required.";
    if (date.trim() === "") newErrors.date = "Date is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.description) descriptionRef.current.focus();
      else if (newErrors.venue) venueRef.current.focus();
      else if (newErrors.date) dateRef.current.focus();
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
    <form className="add-setlist-form" onSubmit={handleSubmit} noValidate>
      {errors.name && (
        <p id="setlist-name-error" className="form-error">{errors.name}</p>
      )}
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter setlist name"
          ref={nameRef}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "setlist-name-error" : undefined}
        />
      </label>
      {errors.description && (
        <p id="setlist-description-error" className="form-error">{errors.description}</p>
      )}
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter setlist description"
          ref={descriptionRef}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "setlist-description-error" : undefined}
        />
      </label>
      {errors.venue && (
        <p id="setlist-venue-error" className="form-error">{errors.venue}</p>
      )}
      <label>
        Venue
        <input
          type="text"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Enter venue name"
          ref={venueRef}
          aria-invalid={!!errors.venue}
          aria-describedby={errors.venue ? "setlist-venue-error" : undefined}
        />
      </label>
      {errors.date && (
        <p id="setlist-date-error" className="form-error">{errors.date}</p>
      )}
      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          ref={dateRef}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? "setlist-date-error" : undefined}
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
