import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./Header.css";

export function Header() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true",
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
            onClick={toggleDarkMode}
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
