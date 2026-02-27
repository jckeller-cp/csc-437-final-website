import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Setlists from "./pages/Setlists";
import Account from "./pages/Account";
import PlaylistDetail from "./pages/PlaylistDetail";
import SetlistDetail from "./pages/SetlistDetail";

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <nav>
            <div className="general-links">
              <Link to="/">Home</Link>
              <Link to="/playlists">Playlists</Link>
              <Link to="/setlists">Setlists</Link>
            </div>
            <div className="account-links">
              <Link to="/account">Account</Link>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/setlists" element={<Setlists />} />
            <Route path="/setlists/:id" element={<SetlistDetail />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
