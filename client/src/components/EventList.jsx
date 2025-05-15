import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // adjust the path as necessary

export default function EventList({ events, setSelectedEvent, fetchEvents }) {
  const { user } = useContext(AuthContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (res.ok) {
      fetchEvents(); // Refresh after delete
    } else {
      alert("Failed to delete event");
    }
  };

  return (
    <div>
      <h3>Your Events</h3>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <strong>{event.title}</strong> — {event.date.split("T")[0]} @{" "}
              {event.location}
              <br />
              <small>{event.description}</small>
              <br />
              <button onClick={() => setSelectedEvent(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
