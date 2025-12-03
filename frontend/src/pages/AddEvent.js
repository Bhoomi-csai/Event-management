import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    description: "",
    location: "",
    category: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first.");
      return navigate("/login");
    }

    const response = await fetch("http://localhost:5001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...eventData,
        date: eventData.date, // Already YYYY-MM-DD (browser date input)
        category: eventData.category.toLowerCase(),
      }),
    });

    const result = await response.json();

    if (result.message) {
      alert("Event added successfully!");
      navigate("/");
    } else {
      alert(result.ERROR || "Something went wrong");
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add New Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          onChange={handleChange}
          required
        />

        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="tech">Tech Events</option>
          <option value="cultural">Cultural Events</option>
          <option value="sports">Sports</option>
          <option value="workshops">Workshops</option>
          <option value="seminars">Seminars</option>
          <option value="clubs">Club Meets</option>
        </select>

        <button type="submit">Save Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
