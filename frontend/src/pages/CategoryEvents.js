import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CategoryEvents = () => {
  const { categoryName } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(
        `http://localhost:5001/api/events/category/${categoryName}`
      );
      const data = await response.json();
      setEvents(data.events || []);
    };

    fetchEvents();
  }, [categoryName]);

  return (
    <div style={{ padding: "25px" }}>
      <h1>{categoryName.toUpperCase()} EVENTS</h1>

      <div className="events-grid">
        {events.length === 0 ? (
          <p>No events found in this category</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleDateString()}</p>
              <p>{event.description}</p>

              {/* STUDENT REGISTER */}
              {role === "STUDENT" && (
                <button
                  onClick={() => {
                    if (!token) return navigate("/login");
                    alert("Registration logic coming soon!");
                  }}
                >
                  Register
                </button>
              )}

              {/* ADMIN EDIT/DELETE */}
              {role === "ADMIN" && (
                <>
                  <button
                    onClick={() => navigate(`/edit-event/${event.id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => navigate(`/delete-event/${event.id}`)}
                  >
                    🗑 Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryEvents;
