import { Link } from "react-router-dom";
import { playlists, setlists } from "../data/dummyData";
import "./Home.css";

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  );
}

function HomeSetlistCard({ setlist }) {
  return (
    <li key={setlist.id} className="home-setlist-card">
      <Link className="home-setlist-name" to={`/setlists/${setlist.id}`}>
        {setlist.name}
      </Link>
      <span className="home-setlist-location">{setlist.venue}</span>
    </li>
  );
}

function Home() {
  return (
    <div className="centered-content">
      <div id="welcome-banner">
        <h1>Welcome to Setlister</h1>
        <p>Manage your playlists and setlists in one place</p>{" "}
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
            <HomeSetlistCard key={setlist.id} setlist={setlist} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
