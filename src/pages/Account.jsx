import "./Account.css";

function ProfileInfo({ user }) {
  return (
    <dl className="profile-info">
      <dt>Name:</dt>
      <dd>{user.name}</dd>
      <dt>Email:</dt>
      <dd>{user.email}</dd>
      <dt>Role:</dt>
      <dd>{user.role}</dd>
      <dt>Member Since:</dt>
      <dd>{user.memberSince}</dd>
    </dl>
  );
}

function StatsCard({ title, value }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{title}</span>
    </div>
  );
}

function Account() {
  // Dummy user data
  const user = {
    name: "Fake Person",
    email: "fake.person@email.com",
    role: "Musician & DJ",
    memberSince: "January 2025",
    totalPlaylists: 5,
    totalSetlists: 3,
  };

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
          <StatsCard title="Playlists Created" value={user.totalPlaylists} />
          <StatsCard title="Setlists Created" value={user.totalSetlists} />
        </div>
      </section>

      <section className="actions-section">
        <h2>Account Actions</h2>
        <button>Edit Profile</button>
        <button>Change Password</button>
        <button>Log Out</button>
      </section>
    </div>
  );
}

export default Account;
