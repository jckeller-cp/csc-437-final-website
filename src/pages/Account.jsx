import "./Account.css";
import StatCard from "../components/StatCard";
import Modal from "../components/Modal";
import { useState, useRef } from "react";

function isValidEmail(stringToTest) {
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
  // Regex from https://colinhacks.com/essays/reasonable-email-regex
  return emailRegex.test(stringToTest);
}

function EditProfileForm({ user, onSave }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const roleRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (name.trim() === "") newErrors.name = "Name is required.";
    if (email.trim() === "") {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (role.trim() === "") newErrors.role = "Role is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.email) emailRef.current.focus();
      else if (newErrors.role) roleRef.current.focus();
      return;
    }

    onSave({
      ...user,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });
  }

  return (
    <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
      {errors.name && (
        <p id="name-error" className="form-error">
          {errors.name}
        </p>
      )}
      <label htmlFor="edit-name">Name</label>
      <input
        id="edit-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={nameRef}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
      />
      {errors.email && (
        <p id="email-error" className="form-error">
          {errors.email}
        </p>
      )}
      <label htmlFor="edit-email">Email</label>
      <input
        id="edit-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
      />
      {errors.role && (
        <p id="role-error" className="form-error">
          {errors.role}
        </p>
      )}
      <label htmlFor="edit-role">Role</label>
      <input
        id="edit-role"
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        ref={roleRef}
        aria-invalid={!!errors.role}
        aria-describedby={errors.role ? "role-error" : undefined}
      />
      <button type="submit">Save Changes</button>
    </form>
  );
}

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

function Account({ onLogout }) {
  const [user, setUser] = useState({
    name: "Fake Person",
    email: "fake.person@email.com",
    role: "Musician & DJ",
    memberSince: "January 2025",
    totalPlaylists: 5,
    totalSetlists: 3,
  });
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  function handleSaveProfile(updatedUser) {
    setUser(updatedUser);
    setEditProfileOpen(false);
  }

  return (
    <div id="account-page">
      <Modal
        isOpen={editProfileOpen}
        title="Edit Profile"
        onCloseRequested={() => setEditProfileOpen(false)}
      >
        <EditProfileForm user={user} onSave={handleSaveProfile} />
      </Modal>

      <h1>Account Settings</h1>

      <section className="profile-section">
        <h2>Profile Information</h2>
        <ProfileInfo user={user} />
      </section>

      <section className="stats-section">
        <h2>Your Stats</h2>
        <div className="stats">
          <StatCard title="Playlists Created" value={user.totalPlaylists} />
          <StatCard title="Setlists Created" value={user.totalSetlists} />
        </div>
      </section>

      <section className="actions-section">
        <h2>Account Actions</h2>
        <button
          className="neutral-button"
          onClick={() => setEditProfileOpen(true)}
        >
          Edit Profile
        </button>
        <button className="neutral-button">Change Password</button>
        <button className="bad-button" onClick={onLogout}>
          Log Out
        </button>
      </section>
    </div>
  );
}

export default Account;
