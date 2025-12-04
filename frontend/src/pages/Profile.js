// src/components/Profile.js
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { FaUserCircle } from "react-icons/fa";
import { getMe, updateUser } from "../api"; // adjust path if api.js is elsewhere

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  const loadProfile = async () => {
    if (!token) {
      console.error("No token found. Redirecting to login.");
      localStorage.clear();
      window.location.href = "/";
      return;
    }

    try {
      const res = await getMe(token);

      // res.ok comes from safeJSON wrapper
      if (!res.ok) {
        console.error("Failed to load profile. Status:", res.status, res.ERROR || res.raw);
        if (res.status === 401) {
          // Unauthorized → token invalid/expired
          localStorage.clear();
          window.location.href = "/";
        }
        return;
      }

      // backend might return { user: { ... } } or directly fields depending on implementation
      const loadedUser = res.user || res.data || res;
      // normalize: if safeJSON returned user inside object, use that
      if (loadedUser && loadedUser.user) {
        setUser(loadedUser.user);
      } else if (res.user) {
        setUser(res.user);
      } else if (res.name || res.email) {
        // res itself is the user object
        setUser(res);
      } else {
        // fallback: try res.data.user or res.data
        if (res.data && res.data.user) setUser(res.data.user);
        else if (res.data) setUser(res.data);
        else console.warn("Couldn't parse user from response", res);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    if (!user) return;

    // Only send fields backend expects (no image, no id/email/role/etc.)
    const {
      name,
      phone,
      roll,
      department,
      year,
      skills,
      about,
      designation,
      office,
    } = user;

    const payload = {
      name,
      phone,
      roll,
      department,
      year,
      skills,
      about,
      designation,
      office,
    };

    try {
      const res = await updateUser(payload, token);

      if (!res.ok) {
        console.error("Error updating profile:", res);
        alert(res.ERROR || res.message || "Failed to update profile");
        return;
      }

      alert("Profile updated successfully!");
      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Something went wrong while saving profile");
    }
  };

  

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        {user.image ? (
          <img src={user.image} className="profile-avatar-img" alt="Profile" />
        ) : (
          <FaUserCircle className="profile-avatar" />
        )}

        {/* Button kept same – just shows alert, no upload logic */}
        

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
            <input value={user.email || ""} disabled />
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
              <button className="save-btn" onClick={saveProfile}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
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
