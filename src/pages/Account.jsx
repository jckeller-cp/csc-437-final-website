import "./Account.css";

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
      </section>

      <section className="stats-section">
        <h2>Your Stats</h2>
        <div className="stats">
          <div className="stat-card">
            <strong>{user.totalPlaylists}</strong>
            <span>Playlists Created</span>
          </div>
          <div className="stat-card">
            <strong>{user.totalSetlists}</strong>
            <span>Setlists Created</span>
          </div>
        </div>
      </section>

      <section className="actions-section">
        <h2>Account Actions</h2>
        <button className="btn-primary">Edit Profile</button>
        <button className="btn-secondary">Change Password</button>
        <button className="btn-danger">Log Out</button>
      </section>
    </div>
  );
}

export default Account;
