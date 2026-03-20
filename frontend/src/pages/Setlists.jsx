import { Link } from "react-router-dom";
import "./Setlists.css";
import Modal from "../components/Modal";
import { useState, useRef, useEffect, useTransition } from "react";

function AddSetlistButton({ onClick }) {
  return (
    <button className="neutral-button" onClick={onClick}>
      + New Setlist
    </button>
  );
}

function AddSetlistForm({ onNewSetlist, playlists, isPending, submitError }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [playlistId, setPlaylistId] = useState(
    playlists.length > 0 ? playlists[0]._id : "",
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
    onNewSetlist({ name, description, venue, date, playlistId });
    setName("");
    setDescription("");
    setVenue("");
    setDate("");
    setPlaylistId(playlists.length > 0 ? playlists[0]._id : "");
  }

  return (
    <form className="add-setlist-form" onSubmit={handleSubmit} noValidate>
      {submitError && <p className="form-error">{submitError}</p>}
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
        />
      </label>
      <label>
        Playlist
        <select
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          aria-label="Playlist"
          disabled={isPending}
        >
          {playlists.map((playlist) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Setlist"}
      </button>
    </form>
  );
}

function SetlistCard({ setlist, playlistName }) {
  return (
    <div className="setlist-card">
      <h2>
        <Link to={`/setlists/${setlist._id}`}>{setlist.name}</Link>
      </h2>
      <p>{setlist.description}</p>
      <div className="setlist-meta">
        <span>{setlist.venue}</span>
        <span>{setlist.date}</span>
        <span>From: {playlistName}</span>
        <span>{setlist.songs.length} songs</span>
      </div>
    </div>
  );
}

function Setlists({ authToken }) {
  const [setlists, setSetlists] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [addSetlistOpen, setAddSetlistOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authToken}` };
    Promise.all([
      fetch("/api/setlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load setlists");
        return res.json();
      }),
      fetch("/api/playlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load playlists");
        return res.json();
      }),
    ])
      .then(([setlistData, playlistData]) => {
        setSetlists(setlistData);
        setPlaylists(playlistData);
      })
      .catch((err) => setError(err.message));
  }, [authToken]);

  const getPlaylistName = (playlistId) => {
    const playlist = playlists.find((p) => p._id === playlistId);
    return playlist ? playlist.name : "Unknown Playlist";
  };

  const handleOpenModal = () => {
    setSubmitError(null);
    setAddSetlistOpen(true);
  };
  const handleCloseModal = () => setAddSetlistOpen(false);

  const addSetlist = ({ name, description, venue, date, playlistId }) => {
    setSubmitError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/setlists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ name, description, venue, date, playlistId }),
        });
        if (!res.ok) throw new Error("Failed to create setlist");
        const created = await res.json();
        setSetlists((prev) => [...prev, created]);
        handleCloseModal();
      } catch (err) {
        setSubmitError(err.message);
      }
    });
  };

  return (
    <div id="setlists-page">
      <Modal
        isOpen={addSetlistOpen}
        title="New Setlist"
        onCloseRequested={handleCloseModal}
      >
        <AddSetlistForm
          onNewSetlist={addSetlist}
          playlists={playlists || []}
          isPending={isPending}
          submitError={submitError}
        />
      </Modal>
      <div className="page-header">
        <h1>Setlists</h1>
        <AddSetlistButton onClick={handleOpenModal} />
      </div>
      {error ? (
        <div className="status-message error">
          <p>Something went wrong: {error}</p>
        </div>
      ) : setlists === null || playlists === null ? (
        <p className="status-message">Loading setlists...</p>
      ) : (
        <div className="setlists-list">
          {setlists.map((setlist) => (
            <SetlistCard
              key={setlist._id}
              setlist={setlist}
              playlistName={getPlaylistName(setlist.playlistId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Setlists;
