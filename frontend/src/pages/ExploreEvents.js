import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExploreEvents.css";

const ExploreEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [registeredEvents, setRegisteredEvents] = useState([]); // Track registered event IDs

  const limit = 8;
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Categories that should NOT show registration
  const noRegistrationCategories = [
    "cultural",
    "cultural event",
    "cultural fest",
    "fest",
    "tech fest",
    "music fest",
    "annual fest",
    "tech event",
  ];

  // FETCH ALL EVENTS
  const loadEvents = async () => {
    const params = new URLSearchParams({
      page,
      limit,
      search: searchTerm,
      category: categoryFilter,
    });

    const response = await fetch(
      `http://localhost:5001/api/events?${params.toString()}`
    );

    const data = await response.json();
    setEvents(data.events || []);
    setTotalEvents(data.total || 0);
  };

  // FETCH STUDENT REGISTERED EVENT IDs
  const loadRegisteredEvents = async () => {
    if (role !== "STUDENT" || !token) return;

    const res = await fetch("http://localhost:5001/api/registrations/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const ids = (data.registrations || []).map((r) => r.event.id);
    setRegisteredEvents(ids);
  };

  // Auto refresh when pages or filters change
  useEffect(() => {
    loadEvents();
    loadRegisteredEvents();
  }, [page, searchTerm, categoryFilter]);

  // Listen for unregister signal from MyRegistrations.jsx
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "refresh-registrations") {
        loadRegisteredEvents();
      }
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const totalPages = Math.ceil(totalEvents / limit);

  // Logic to determine if event needs registration
  const eventNeedsRegistration = (category) => {
    if (!category) return true;
    return !noRegistrationCategories.includes(category.toLowerCase());
  };

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore All Events</h1>

      {/* SEARCH + FILTER */}
      <div className="explore-controls">
        <input
          type="text"
          placeholder="Search by title..."
          className="search-input"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="filter-select"
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="workshops">Workshops</option>
          <option value="seminars">Seminars</option>
          <option value="clubs">Club Meets</option>
        </select>
      </div>

      {/* EVENTS GRID */}
      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">

            {event.image && <img src={event.image} alt="" className="event-img" />}

            <h3>{event.title}</h3>

            <p className="event-date">
              <b>Date:</b> {new Date(event.date).toLocaleDateString()}
            </p>

            <p><b>Location:</b> {event.location}</p>

            {event.startTime && event.endTime && (
              <p><b>Time:</b> {event.startTime} - {event.endTime}</p>
            )}

            <p className="event-desc">{event.description}</p>

            <p className="event-cat"><b>Category:</b> {event.category}</p>

            {/* STUDENT REGISTER UI */}
            {role === "STUDENT" && eventNeedsRegistration(event.category) && (

              registeredEvents.includes(event.id) ? (
                <button className="btn-registered" disabled>
                  ✓ Registered
                </button>
              ) : (
                <button
                  className="btn-register"
                  onClick={async () => {
                    if (!token) return navigate("/login");

                    const res = await fetch(
                      "http://localhost:5001/api/registrations/register",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ eventId: event.id }),
                      }
                    );

                    const data = await res.json();

                    if (data.message) {
                      alert("Successfully Registered!");
                      setRegisteredEvents((prev) => [...prev, event.id]);
                    } else {
                      alert(data.ERROR || "Something went wrong");
                    }
                  }}
                >
                  Register
                </button>
              )

            )}

          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExploreEvents;
