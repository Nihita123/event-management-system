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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate capacity percentage
  const calculateCapacityPercentage = (attendees, capacity) => {
    if (!capacity) return 0;
    const percentage = Math.round((attendees / capacity) * 100);
    return Math.min(percentage, 100); // Cap at 100%
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
          {sortedEvents.map((event) => {
            const attendeeCount = event.attendees || 0;
            const capacityPercentage = calculateCapacityPercentage(
              attendeeCount,
              event.capacity
            );
            const revenue = event.revenue || 0;
            const isUpcoming = new Date(event.date) > new Date();

            return (
              <div key={event._id} className="event-card">
                <div className="event-image-container">
                  {/* Category badge */}
                  <div className="event-category-badge">
                    {event.category || "General"}
                  </div>

                  {/* Fallback letter if no image */}
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="event-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-event-image.jpg";
                      }}
                    />
                  ) : (
                    <div className="event-letter-placeholder">
                      {event.title?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="event-card-content">
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-date-time">
                    {new Date(event.date).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="event-location">
                    {event.location || "Unknown location"}
                  </p>
                  <p className="event-price">
                    {formatCurrency(event.price || 0)}
                  </p>
                  <p className="event-description">
                    {event.description || "No description provided."}
                  </p>

                  <div className="event-button-container">
                    <button
                      className="event-action-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
