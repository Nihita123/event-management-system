import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./EventList.css";

export default function EventList({ events, setSelectedEvent, fetchEvents }) {
  const { user } = useContext(AuthContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      fetchEvents();
    } else {
      alert("Failed to delete event");
    }
  };

  // Sort events by date with newest first
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="event-list-container">
      {events.length === 0 ? (
        <div className="no-events-card">
          <div className="empty-state-icon">📅</div>
          <h3>No events created yet</h3>
          <p>Start by creating your first event using the button above</p>
        </div>
      ) : (
        <div className="event-cards-grid">
          {sortedEvents.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <div className="event-date-tag">{formatDate(event.date)}</div>
                <div className="event-actions">
                  <button
                    className="edit-btn"
                    onClick={() => setSelectedEvent(event)}
                    aria-label="Edit event"
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(event._id)}
                    aria-label="Delete event"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="event-card-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-location">
                  <i className="fa-solid fa-location-dot"></i>
                  {event.location}
                </div>
                <p className="event-description">
                  {event.description.substring(0, 100)}
                  {event.description.length > 100 ? "..." : ""}
                </p>

                <div className="event-stats">
                  <div className="attendees-stat">
                    <i className="fa-solid fa-users"></i>
                    <span>{Math.floor(Math.random() * 50) + 10} attending</span>
                  </div>
                  <div className="capacity-stat">
                    <i className="fa-solid fa-chart-simple"></i>
                    <span>{Math.floor(Math.random() * 30) + 70}% capacity</span>
                  </div>
                </div>
              </div>

              <div className="event-card-footer">
                <button
                  className="view-details-btn"
                  onClick={() => setSelectedEvent(event)}
                >
                  View Details
                </button>

                <div className="event-status">
                  <span
                    className={`status-indicator ${
                      new Date(event.date) > new Date() ? "upcoming" : "past"
                    }`}
                  ></span>
                  <span>
                    {new Date(event.date) > new Date() ? "Upcoming" : "Past"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
