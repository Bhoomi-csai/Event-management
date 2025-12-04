import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EventRegistrations.css";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  const loadRegistrations = async () => {
    const res = await fetch(`http://localhost:5001/api/registrations/admin/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  if (!data) return <h2 className="loading-text">Loading...</h2>;

  return (
    <div className="event-students-container">
      <h1>{data.event.title}</h1>

      <table className="students-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Contact</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {data.students.length === 0 ? (
            <tr>
              <td colSpan="4">No registrations for this event.</td>
            </tr>
          ) : (
            data.students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.roll || "—"}</td>
                <td>{s.phone || "—"}</td>
                <td>{s.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventRegistrations;
