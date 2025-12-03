import React from "react";
import "./Profile.css";

const Profile = () => {
  const user = {
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-card">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
