import "./Account.css";
import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";

function ProfileInfo({ user }) {
  return (
    <dl className="profile-info">
      <dt>Username:</dt>
      <dd>{user.username}</dd>
      <dt>Email:</dt>
      <dd>{user.email}</dd>
    </dl>
  );
}

function Account({ authToken }) {
  const [user, setUser] = useState(null);
  const [playlistCount, setPlaylistCount] = useState(null);
  const [setlistCount, setSetlistCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authToken}` };
    Promise.all([
      fetch("/api/users/me", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load account info");
        return res.json();
      }),
      fetch("/api/playlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load playlists");
        return res.json();
      }),
      fetch("/api/setlists", { headers }).then((res) => {
        if (!res.ok) throw new Error("Failed to load setlists");
        return res.json();
      }),
    ])
      .then(([userData, playlists, setlists]) => {
        setUser(userData);
        setPlaylistCount(playlists.length);
        setSetlistCount(setlists.length);
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

  if (user === null) {
    return <p className="status-message">Loading account...</p>;
  }

  return (
    <div id="account-page">
      <h1>Account Settings</h1>

      <section className="profile-section">
        <h2>Profile Information</h2>
        <ProfileInfo user={user} />
      </section>

      <section className="stats-section">
        <h2>Your Stats</h2>
        <div className="stats">
          <StatCard
            title="Playlists Created"
            value={playlistCount === null ? "..." : playlistCount}
          />
          <StatCard
            title="Setlists Created"
            value={setlistCount === null ? "..." : setlistCount}
          />
        </div>
      </section>

      <section className="actions-section">
        <h2>Account Actions</h2>
        <button className="neutral-button">Change Password</button>
      </section>
    </div>
  );
}

export default Account;
