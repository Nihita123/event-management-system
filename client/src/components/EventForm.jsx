import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Make sure the path is correct

export default function EventForm({
  selectedEvent,
  setSelectedEvent,
  fetchEvents,
}) {
  const { user, token } = useContext(AuthContext);
  // Using context to get the user data

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date.split("T")[0],
        location: selectedEvent.location,
      });
    }
  }, [selectedEvent]); // Depend on selectedEvent to re-run when it changes

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
    console.log("🧪 user.token:", user?.token);

    if (res.ok) {
      setFormData({ title: "", description: "", date: "", location: "" });
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
      <button type="submit">{selectedEvent ? "Update" : "Create"}</button>
      {selectedEvent && (
        <button type="button" onClick={() => setSelectedEvent(null)}>
          Cancel
        </button>
      )}
    </form>
  );
}
