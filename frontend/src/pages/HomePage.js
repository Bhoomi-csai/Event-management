import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "ADMIN" or "STUDENT"
  const [menu, setMenu] = useState(false);

  /* ========================
      BUTTON HANDLERS
  ========================== */

  const goToExplore = () => {
    if (!token) navigate("/login");
    else navigate("/explore");
  };

  const goToRegisteredEvents = () => {
    if (!token) navigate("/login");
    else navigate("/my-registrations");
  };

  const goToAddEvent = () => {
    if (!token || role !== "ADMIN") navigate("/login");
    else navigate("/add-event");
  };

  const goToReleasedEvents = () => {
    if (!token || role !== "ADMIN") navigate("/login");
    else navigate("/released-events");
  };

  const openCategory = (category) => {
    if (!token) navigate("/login");
    else navigate(`/category/${category}`);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="homepage-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="navbar-logo">Campus Connect</h2>

        <div className="navbar-buttons">
          {!token ? (
            <>
              <button onClick={() => navigate("/login")} className="btn-login">Login</button>
              <button onClick={() => navigate("/signup")} className="btn-signup">Sign Up</button>
            </>
          ) : (
            <div className="user-box">
              <FaUserCircle className="user-icon" onClick={() => setMenu(!menu)} />

              {menu && (
                <div className="nav-menu">

                  {/* PROFILE */}
                  <p onClick={() => { navigate("/profile"); setMenu(false); }}>
                    <FaUser /> Profile
                  </p>

                  

                  {/* LOGOUT */}
                  <p className="logout" onClick={() => { logout(); setMenu(false); }}>
                    <FaSignOutAlt /> Logout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>



      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Discover Campus Life <br />
            Like Never Before
          </h1>

          <p>Find events, join clubs, explore workshops and celebrate your college life.</p>

          <div className="hero-buttons">

            {/* STUDENT BUTTONS */}
            {role === "STUDENT" && token && (
              <>
                <button className="btn-primary" onClick={goToExplore}>
                  Explore Events
                </button>

                <button className="btn-register-event" onClick={goToRegisteredEvents}>
                  📝 Registered Events
                </button>
              </>
            )}

            {/* ADMIN BUTTONS */}
            {role === "ADMIN" && token && (
              <>
                <button className="btn-add-event" onClick={goToAddEvent}>
                  ➕ Add Event
                </button>

                <button className="btn-released-event" onClick={goToReleasedEvents}>
                  📢 Released Events
                </button>
              </>
            )}

            {/* NO LOGIN YET */}
            {!token && (
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Explore Events
              </button>
            )}
          </div>
        </div>


        {/* FLOATING CARDS */}
        <div className="floating-cards">
          <div className="card purple">Tech Hackathon</div>
          <div className="card pink">Music Fest</div>
          <div className="card blue">Sports Championship</div>
          <div className="card yellow">Art Workshop</div>
        </div>
      </section>



      {/* CATEGORIES SECTION */}
      <section className="categories-section">
        <h2>Explore Categories</h2>

        <div className="categories-grid">
          <div className="category-box purple-cat" onClick={() => openCategory("tech")}>Tech Events</div>
          <div className="category-box pink-cat" onClick={() => openCategory("cultural")}>Cultural Events</div>
          <div className="category-box blue-cat" onClick={() => openCategory("sports")}>Sports</div>
          <div className="category-box yellow-cat" onClick={() => openCategory("workshops")}>Workshops</div>
          <div className="category-box teal-cat" onClick={() => openCategory("seminars")}>Seminars</div>
          <div className="category-box orange-cat" onClick={() => openCategory("clubs")}>Club Meets</div>
        </div>
      </section>



      {/* BENEFITS SECTION */}
      <section className="benefits-section">
        <h2>Why You'll Love CampusConnect</h2>

        <div className="benefits-grid">
          <div className="benefit-item">Centralized Event Updates</div>
          <div className="benefit-item">Quick Registration</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
