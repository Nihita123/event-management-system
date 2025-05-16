import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EventRegistration from "../components/EventRegistration";
import "./AttendeeDashboard.css";

export default function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { user, token, loading, error } = useContext(AuthContext);
  const [filterType, setFilterType] = useState("all");

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/registrations/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch registrations");
      }
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchRegistrations();
    }
  }, [token]);

  const getUpcomingEvents = () => {
    const now = new Date();
    return events.filter((event) => new Date(event.date) >= now);
  };

  const getRegisteredEvents = () => {
    // Get event IDs that the user has registered for
    const registeredEventIds = registrations.map((reg) => reg.event?._id);
    // Return events that match these IDs
    return events.filter((event) => registeredEventIds.includes(event._id));
  };

  const getFilteredEvents = () => {
    let filteredEvents;
    if (activeTab === "upcoming") {
      filteredEvents = getUpcomingEvents();
    } else if (activeTab === "registered") {
      filteredEvents = getRegisteredEvents();
    } else {
      filteredEvents = events;
    }

    // Apply category filter if not 'all'
    if (filterType !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === filterType
      );
    }

    return filteredEvents;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleRegistrationComplete = () => {
    fetchRegistrations();
    setShowRegistrationForm(false);
  };

  const isRegistered = (eventId) => {
    return registrations.some((reg) => reg.event?._id === eventId);
  };

  const getRegistrationStatus = (eventId) => {
    const registration = registrations.find(
      (reg) => reg.event?._id === eventId
    );
    return registration ? registration.status : null;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access this page.</p>
        <a href="/login" className="login-redirect-btn">
          Go to Login
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="logo">EventHub</div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`nav-item ${activeTab === "registered" ? "active" : ""}`}
            onClick={() => setActiveTab("registered")}
          >
            My Registrations
          </button>
          <button
            className={`nav-item ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Events
          </button>
        </nav>

        <div className="filter-section">
          <h3 className="filter-title">Filter by Category</h3>
          <div className="filters">
            <button
              className={`filter-btn ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              All Categories
            </button>
            <button
              className={`filter-btn ${
                filterType === "conference" ? "active" : ""
              }`}
              onClick={() => setFilterType("conference")}
            >
              Conferences
            </button>
            <button
              className={`filter-btn ${
                filterType === "workshop" ? "active" : ""
              }`}
              onClick={() => setFilterType("workshop")}
            >
              Workshops
            </button>
            <button
              className={`filter-btn ${
                filterType === "seminar" ? "active" : ""
              }`}
              onClick={() => setFilterType("seminar")}
            >
              Seminars
            </button>
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Attendee</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-content">
          <div className="events-page">
            <div className="page-header">
              <h1>
                {activeTab === "upcoming"
                  ? "Upcoming Events"
                  : activeTab === "registered"
                  ? "My Registrations"
                  : "All Events"}
              </h1>
            </div>

            {showRegistrationForm && selectedEvent ? (
              <div className="registration-form-container">
                <button
                  className="back-button"
                  onClick={() => setShowRegistrationForm(false)}
                >
                  ← Back to Events
                </button>
                <EventRegistration
                  event={selectedEvent}
                  onRegistrationComplete={handleRegistrationComplete}
                />
              </div>
            ) : (
              <>
                <div className="events-container">
                  <div className="events-header">
                    <div className="events-count">
                      <span>{getFilteredEvents().length}</span> events found
                    </div>
                  </div>

                  {getFilteredEvents().length === 0 ? (
                    <div className="no-events">
                      <div className="empty-state-icon">🎭</div>
                      <h3>No events found</h3>
                      <p>
                        {activeTab === "registered"
                          ? "You haven't registered for any events yet."
                          : "No events match your criteria."}
                      </p>
                    </div>
                  ) : (
                    <div className="events-grid">
                      {getFilteredEvents().map((event) => (
                        <div key={event._id} className="event-card">
                          <div className="event-image">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-event.jpg";
                                }}
                              />
                            ) : (
                              <div className="placeholder-image">
                                <span>{event.title.charAt(0)}</span>
                              </div>
                            )}
                            <div className="event-category">
                              {event.category}
                            </div>
                          </div>
                          <div className="event-details">
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-meta">
                              <div className="event-date">
                                <i className="fas fa-calendar-alt"></i>
                                {formatDate(event.date)}
                              </div>
                              <div className="event-location">
                                <i className="fas fa-map-marker-alt"></i>
                                {event.location}
                              </div>
                            </div>
                            <div className="event-price">
                              ${event.ticketPrice || 25}
                            </div>
                            <p className="event-description">
                              {event.description.length > 100
                                ? `${event.description.substring(0, 100)}...`
                                : event.description}
                            </p>
                            <div className="event-actions">
                              {isRegistered(event._id) ? (
                                <div className="registration-status">
                                  <span
                                    className={`status-badge ${getRegistrationStatus(
                                      event._id
                                    )}`}
                                  >
                                    {getRegistrationStatus(event._id) ===
                                    "registered"
                                      ? "Registered"
                                      : getRegistrationStatus(event._id) ===
                                        "attended"
                                      ? "Attended"
                                      : "Cancelled"}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className="register-btn"
                                  onClick={() => handleEventClick(event)}
                                >
                                  Register Now
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
