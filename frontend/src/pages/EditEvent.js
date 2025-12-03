import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  // Load existing event data
  const fetchEvent = async () => {
    const response = await fetch(`http://localhost:5001/api/events/${id}`);
    const data = await response.json();

    if (data.event) {
      setEventData({
        title: data.event.title,
        description: data.event.description,
        location: data.event.location,
        date: data.event.date.split("T")[0], // convert to YYYY-MM-DD
        startTime: data.event.startTime || "",
        endTime: data.event.endTime || "",
        category: data.event.category,
      });
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Update event
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:5001/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...eventData,
        category: eventData.category.toLowerCase(),
      }),
    });

    const result = await response.json();

    if (result.message) {
      alert("Event updated successfully!");
      navigate("/released-events");
    } else {
      alert(result.ERROR || "Something went wrong");
    }
  };

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit} className="edit-form">

        <input
          type="text"
          name="title"
          value={eventData.title}
          placeholder="Event Title"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          value={eventData.location}
          placeholder="Event Location"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="startTime"
          value={eventData.startTime}
          placeholder="Start Time (e.g. 10:00 AM)"
          onChange={handleChange}
        />

        <input
          type="text"
          name="endTime"
          value={eventData.endTime}
          placeholder="End Time (e.g. 4:00 PM)"
          onChange={handleChange}
        />

        <textarea
          name="description"
          value={eventData.description}
          placeholder="Event Description"
          onChange={handleChange}
          required
        />

        <select name="category" value={eventData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="tech">Tech</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="workshops">Workshops</option>
          <option value="seminars">Seminars</option>
          <option value="clubs">Club Meets</option>
        </select>

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEvent;
