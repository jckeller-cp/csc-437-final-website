import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Setlists from "./pages/Setlists";
import Account from "./pages/Account";
import PlaylistDetail from "./pages/PlaylistDetail";
import SetlistDetail from "./pages/SetlistDetail";
import Login from "./pages/Login";

function LoggedOutHeader({ darkMode, onToggleDarkMode }) {
  return (
    <header>
      <nav>
        <div className="general-links">
          <Link to="/login">Home</Link>
        </div>
        <div className="account-links">
          <button
            className="dark-mode-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>
    </header>
  );
}

function LoggedInHeader({ darkMode, onToggleDarkMode }) {
  return (
    <header>
      <nav>
        <div className="general-links">
          <Link to="/">Home</Link>
          <Link to="/playlists">Playlists</Link>
          <Link to="/setlists">Setlists</Link>
        </div>
        <div className="account-links">
          <button
            className="dark-mode-toggle"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <Link to="/account">Account</Link>
        </div>
      </nav>
    </header>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (!isLoggedIn) {
    return (
      <Router>
        <div className="app">
          <LoggedOutHeader darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
          <main>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app">
        <LoggedInHeader darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/setlists" element={<Setlists />} />
            <Route path="/setlists/:id" element={<SetlistDetail />} />
            <Route path="/account" element={<Account onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
