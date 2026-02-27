import { useParams, Link } from "react-router-dom";
import { setlists, playlists } from "../data/dummyData";
import "./SetlistDetail.css";

function SetlistDetail() {
  const { id } = useParams();
  const setlist = setlists.find((s) => s.id === parseInt(id));

  const handleAddSong = () => {
    alert("Add song to setlist functionality would go here");
  };

  if (!setlist) {
    return (
      <div>
        <h2>Setlist Not Found</h2>
        <Link to="/setlists">Back to Setlists</Link>
      </div>
    );
  }

  const playlist = playlists.find((p) => p.id === setlist.playlistId);

  const getSongDetails = (songId) => {
    if (!playlist) return null;
    return playlist.songs.find((s) => s.id === songId);
  };

  return (
    <div id="setlist-detail-page">
      <h1>{setlist.name}</h1>
      <p>{setlist.description}</p>

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

      <div className="page-header">
        <h2>Songs ({setlist.songs.length})</h2>
        <button className="add-button" onClick={handleAddSong}>
          + Add Song
        </button>
      </div>
      <ul className="songs-list">
        {setlist.songs.map((item, index) => {
          const song = getSongDetails(item.songId);
          return song ? (
            <li key={item.songId} className="song-card">
              <div className="song-number">{index + 1}</div>
              <div className="song-details">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
                {item.notes && <p className="song-notes">{item.notes}</p>}
              </div>
              <div className="song-metadata">
                <span className="song-duration">{song.duration}</span>
                <span className="song-bpm">{song.bpm} BPM</span>
                <span className="song-key">{song.key}</span>
              </div>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
}

export default SetlistDetail;
