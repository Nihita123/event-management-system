import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import AnalyticsPanel from "../components/AnalyticsPanel";
import "./OrganizerDashboard.css";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, token, loading, error } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events/my-events", {
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

  useEffect(() => {
    if (token) {
      fetchEvents();
    }
  }, [token]);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
    if (isFormVisible) {
      setSelectedEvent(null);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsFormVisible(true);
    setActiveTab("events");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-sidebar">
        <div className="logo">EventHub</div>
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Organizer</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="nav-icon">📊</i>
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <i className="nav-icon">📅</i>
            Events
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <i className="nav-icon">📈</i>
            Analytics
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="topbar-actions">
            {activeTab === "events" && (
              <button className="create-event-btn" onClick={toggleForm}>
                {isFormVisible ? "Cancel" : "Create New Event"}
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === "dashboard" && (
            <div className="dashboard-overview">
              <div className="overview-header">
                <h2>Welcome, {user.name}</h2>
                <p>Here's an overview of your event management activities</p>
              </div>

              <div className="stats-summary">
                <div className="stat-card total-events">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>Total Events</h3>
                    <p>{events.length}</p>
                  </div>
                </div>

                <div className="stat-card upcoming-events">
                  <div className="stat-icon">🗓️</div>
                  <div className="stat-info">
                    <h3>Upcoming</h3>
                    <p>
                      {
                        events.filter((e) => new Date(e.date) > new Date())
                          .length
                      }
                    </p>
                  </div>
                </div>

                <div className="stat-card past-events">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed</h3>
                    <p>
                      {
                        events.filter((e) => new Date(e.date) <= new Date())
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <AnalyticsPanel />

              {events.length > 0 && (
                <div className="recent-events">
                  <div className="section-header">
                    <h2>Recent Events</h2>
                    <button
                      className="view-all-btn"
                      onClick={() => setActiveTab("events")}
                    >
                      View All
                    </button>
                  </div>
                  <EventList
                    events={events.slice(0, 3)}
                    setSelectedEvent={handleEditEvent}
                    fetchEvents={fetchEvents}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="events-page">
              {isFormVisible && (
                <div className="form-container">
                  <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>
                  <EventForm
                    selectedEvent={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                    fetchEvents={() => {
                      fetchEvents();
                      setIsFormVisible(false);
                    }}
                  />
                </div>
              )}

              <div className="events-container">
                <div className="events-header">
                  <h2>Your Events</h2>
                  <div className="events-count">
                    <span>{events.length}</span> events found
                  </div>
                </div>
                {events.length === 0 ? (
                  <div className="no-events">
                    <p>You haven't created any events yet.</p>
                    <button
                      className="create-first-event-btn"
                      onClick={() => setIsFormVisible(true)}
                    >
                      Create Your First Event
                    </button>
                  </div>
                ) : (
                  <EventList
                    events={events}
                    setSelectedEvent={handleEditEvent}
                    fetchEvents={fetchEvents}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-page">
              <AnalyticsPanel fullView={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
