import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); 

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      "http://localhost:5001/api/upload/profile-picture",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await res.json();
    setUser({ ...user, image: data.imageUrl });
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      alert("Profile updated successfully!");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        {preview ? (
          <img src={preview} className="profile-avatar-img" alt="Preview" />
        ) : user.image ? (
          <img src={user.image} className="profile-avatar-img" alt="Profile" />
        ) : (
          <FaUserCircle className="profile-avatar" />
        )}

        {editMode && (
          <label className="upload-label">
            Change Photo
            <input type="file" accept="image/*" onChange={uploadImage} />
          </label>
        )}

        <h1 className="profile-name">{user.name}</h1>
        <p className="role-tag">{user.role}</p>
      </div>

      <div className="profile-card">
        <h2 className="section-title">Profile Information</h2>

        <div className="profile-grid">

          <div className="field-box full">
            <label>Name</label>
            <input
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="field-box full">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>

          <div className="field-box full">
            <label>Phone</label>
            <input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          {user.role === "STUDENT" && (
            <>
              <div className="field-box">
                <label>College ID / Roll No.</label>
                <input
                  name="roll"
                  value={user.roll || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box">
                <label>Department</label>
                <input
                  name="department"
                  value={user.department || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box">
                <label>Year / Semester</label>
                <input
                  name="year"
                  value={user.year || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box full">
                <label>Skills</label>
                <input
                  name="skills"
                  value={user.skills || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box full">
                <label>About Me</label>
                <textarea
                  name="about"
                  value={user.about || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <div className="field-box">
                <label>Designation</label>
                <input
                  name="designation"
                  value={user.designation || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box">
                <label>Department</label>
                <input
                  name="department"
                  value={user.department || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box">
                <label>Office No.</label>
                <input
                  name="office"
                  value={user.office || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>

              <div className="field-box full">
                <label>About Admin</label>
                <textarea
                  name="about"
                  value={user.about || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                />
              </div>
            </>
          )}
        </div>

        <div className="profile-buttons">
          {!editMode ? (
            <>
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>

              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={saveProfile}>Save</button>
              <button className="cancel-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
