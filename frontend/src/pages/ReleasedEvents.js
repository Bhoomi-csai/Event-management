import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReleasedEvents.css";

const ReleasedEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const limit = 7;

  const loadEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/events/admin?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      setEvents(data.events || []);
      setTotalEvents(data.total || 0);
    } catch (err) {
      console.log("Error loading events:", err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;

    const response = await fetch(`http://localhost:5001/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    alert(result.message || result.ERROR);

    // refresh list
    loadEvents();
  };

  const totalPages = Math.ceil(totalEvents / limit);

  return (
    <div className="released-container">
      <h1 className="released-title">Your Released Events</h1>

      <div className="released-grid">
        {events.length === 0 ? (
          <p className="no-events">You have not created any events yet.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="released-card">

              {event.image && (
                <img src={event.image} className="released-img" alt="Event" />
              )}

              <h3>{event.title}</h3>

              <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
              <p><b>Location:</b> {event.location}</p>
              <p><b>Category:</b> {event.category}</p>

              {event.startTime && event.endTime && (
                <p><b>Time:</b> {event.startTime} - {event.endTime}</p>
              )}

              <p className="desc">{event.description}</p>

              <div className="released-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-event/${event.id}`)}
                >
                  ✏ Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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

export default ReleasedEvents;
