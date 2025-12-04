import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ExploreEvents.css"; 

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
    <div className="explore-container">
      <h1 className="explore-title">{categoryName.toUpperCase()} EVENTS</h1>

      <div className="events-grid">
        {events.length === 0 ? (
          <p>No events found in this category</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">

              {event.image && (
                <img src={event.image} alt="" className="event-img" />
              )}

              <h3>{event.title}</h3>

              <p className="event-date">
                <b>Date:</b> {new Date(event.date).toLocaleDateString()}
              </p>

              <p><b>Location:</b> {event.location}</p>

              {event.startTime && event.endTime && (
                <p><b>Time:</b> {event.startTime} - {event.endTime}</p>
              )}

              <p className="event-desc">{event.description}</p>

              <p className="event-cat">
                <b>Category:</b> {event.category}
              </p>

              {role === "STUDENT" && (
                <button
                  className="btn-register"
                  onClick={() => {
                    if (!token) return navigate("/login");
                    alert("Registration feature coming soon!");
                  }}
                >
                  Register
                </button>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryEvents;
