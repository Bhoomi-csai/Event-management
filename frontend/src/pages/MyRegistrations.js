import React, { useEffect, useState } from "react";
import "./MyRegistrations.css";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const token = localStorage.getItem("token");

  const loadRegistrations = async () => {
    const response = await fetch("http://localhost:5001/api/registrations/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setRegistrations(data.registrations || []);
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Are you sure you want to unregister?")) return;

    const response = await fetch(
      `http://localhost:5001/api/registrations/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result = await response.json();

    if (result.message) {
      alert("You have unregistered from this event.");

      localStorage.setItem("refresh-registrations", Date.now());

      loadRegistrations();
    } else {
      alert(result.ERROR || "Something went wrong");
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return (
    <div className="reg-container">
      <h1>My Registered Events</h1>

      <div className="reg-grid">
        {registrations.length === 0 ? (
          <p>No event registrations yet.</p>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="reg-card">
              <h3>{reg.event.title}</h3>

              <p>
                <b>Date:</b> {new Date(reg.event.date).toLocaleDateString()}
              </p>

              <p><b>Location:</b> {reg.event.location}</p>
              <p><b>Category:</b> {reg.event.category}</p>

              <p className="desc">{reg.event.description}</p>

              <button
                className="unregister-btn"
                onClick={() => handleWithdraw(reg.id)}
              >
                 Unregister
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
