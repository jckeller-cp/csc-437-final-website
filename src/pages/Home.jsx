import { Link } from "react-router-dom";
import { playlists, setlists } from "../data/dummyData";
import "./Home.css";

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
          <div className="stat-card">
            <strong>{playlists.length}</strong>
            <span>Playlists</span>
          </div>
          <div className="stat-card">
            <strong>{setlists.length}</strong>
            <span>Setlists</span>
          </div>
          <div className="stat-card">
            <strong>
              {playlists.reduce((sum, p) => sum + p.songs.length, 0)}
            </strong>
            <span>Total Songs</span>
          </div>
        </div>
      </section>

      <section id="recent-setlists">
        <h2>Recent Setlists</h2>
        <ul className="home-setlist-list">
          {setlists.map((setlist) => (
            <li key={setlist.id} className="home-setlist-card">
              <Link
                className="home-setlist-name"
                to={`/setlists/${setlist.id}`}
              >
                {setlist.name}
              </Link>
              <span className="home-setlist-location">{setlist.venue}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
