import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";
import StatCard from "../components/StatCard";

function HomeSetlistCard({ setlist }) {
  return (
    <li className="home-setlist-card">
      <Link className="home-setlist-name" to={`/setlists/${setlist._id}`}>
        {setlist.name}
      </Link>
      <span className="home-setlist-location">{setlist.venue}</span>
    </li>
  );
}

function Home({ authToken }) {
  const [playlists, setPlaylists] = useState(null);
  const [setlists, setSetlists] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authToken}` };
    Promise.all([
      fetch("/api/playlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load playlists");
        return res.json();
      }),
      fetch("/api/setlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load setlists");
        return res.json();
      }),
    ])
      .then(([playlistData, setlistData]) => {
        setPlaylists(playlistData);
        setSetlists(setlistData);
      })
      .catch((err) => setError(err.message));
  }, [authToken]);

  if (error) {
    return (
      <div className="status-message error">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  if (playlists === null || setlists === null) {
    return <p className="status-message">Loading...</p>;
  }

  return (
    <div className="centered-content">
      <div id="welcome-banner">
        <h1>Welcome to Setlister</h1>
        <p>Manage your playlists and setlists in one place</p>
      </div>

      <section id="quick-stats">
        <h2>Quick Stats</h2>
        <div className="stats">
          <StatCard title="Playlists" value={playlists.length} />
          <StatCard title="Setlists" value={setlists.length} />
          <StatCard
            title="Total Songs"
            value={playlists.reduce((sum, p) => sum + p.songs.length, 0)}
          />
        </div>
      </section>

      <section id="recent-setlists">
        <h2>Recent Setlists</h2>
        <ul className="home-setlist-list">
          {setlists.map((setlist) => (
            <HomeSetlistCard key={setlist._id} setlist={setlist} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
