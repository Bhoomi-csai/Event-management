import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisteredEventsDashboard.css";

const RegisteredEventsDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8; 

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

 
  const loadEvents = async () => {
    const res = await fetch(
      "http://localhost:5001/api/registrations/admin/events",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setEvents(data.events || []);
    setFilteredEvents(data.events || []);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  
  useEffect(() => {
    let updatedList = [...events];

    if (searchTerm.trim() !== "") {
      updatedList = updatedList.filter((e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "") {
      updatedList = updatedList.filter(
        (e) => (e.category || "").toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredEvents(updatedList);
    setCurrentPage(1); 
  }, [searchTerm, categoryFilter, events]);

  
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="admin-events-container">
      <h1>Event Registrations Overview</h1>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by event title..."
          className="admin-search"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="admin-filter"
          onChange={(e) => setCategoryFilter(e.target.value)}
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

      <div className="admin-events-grid">
        {currentEvents.length === 0 ? (
          <p className="no-events-message">No events found.</p>
        ) : (
          currentEvents.map((event) => (
            <div
              key={event.id}
              className="admin-event-card"
              onClick={() =>
                navigate(`/admin/event/${event.id}/registrations`)
              }
            >
              <h3>{event.title}</h3>
              <p>
                <b>Date:</b> {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <b>Category:</b> {event.category}
              </p>

              <div className="registration-count">
                {event.registrationCount} Registrations
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`page-btn ${currentPage === idx + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegisteredEventsDashboard;
