import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Make sure the path is correct

export default function EventForm({
  selectedEvent,
  setSelectedEvent,
  fetchEvents,
}) {
  const { user, token } = useContext(AuthContext);
  // Using context to get the user data

  // Add to formData state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    ticketPrice: "",
    category: "",
  });

  useEffect(() => {
    console.log("🔍 token state:", token);
    console.log("🔍 user state:", user);
  }, [token, user]);

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date.split("T")[0],
        time: selectedEvent.time || "", // <-- add this
        location: selectedEvent.location,
        ticketPrice: selectedEvent.ticketPrice,
        category: selectedEvent.category,
      });
    }
  }, [selectedEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = selectedEvent ? "PUT" : "POST";
    const url = selectedEvent
      ? `http://localhost:5000/api/events/${selectedEvent._id}`
      : "http://localhost:5000/api/events";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    console.log("🧪 token from context:", token);

    if (res.ok) {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        ticketPrice: "",
        category: "",
      });

      setSelectedEvent(null);
      fetchEvents(); // Refresh list of events after submission
    } else {
      alert("Error submitting event");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{selectedEvent ? "Edit Event" : "Create New Event"}</h3>
      <input
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="ticketPrice"
        placeholder="Ticket Price"
        value={formData.ticketPrice}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />

      <button type="submit">{selectedEvent ? "Update" : "Create"}</button>
      {selectedEvent && (
        <button type="button" onClick={() => setSelectedEvent(null)}>
          Cancel
        </button>
      )}
    </form>
  );
}
