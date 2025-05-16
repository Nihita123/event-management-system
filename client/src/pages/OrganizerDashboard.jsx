import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EventForm from "../components/EventForm";
import EventList from "../components/EventList";
import AnalyticsPanel from "../components/AnalyticsPanel";
import "./OrganizerDashboard.css";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, token, loading, error } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      applyFilter(activeFilter, data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/registrations/my-registrations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch registrations");
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const applyFilter = (filter, eventsData = events) => {
    const now = new Date();

    let filtered;
    if (filter === "upcoming") {
      filtered = eventsData.filter((event) => new Date(event.date) >= now);
    } else if (filter === "past") {
      filtered = eventsData.filter((event) => new Date(event.date) < now);
    } else {
      filtered = eventsData;
    }

    setFilteredEvents(filtered);
    setActiveFilter(filter);
  };

  useEffect(() => {
    if (token) {
      fetchEvents();
      fetchRegistrations();
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

  const formatMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // Day of week (0-6)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Last day of month

    const days = [];
    // Add empty cells for days before the first of month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: "", isCurrentMonth: false });
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday:
          new Date().getDate() === i &&
          new Date().getMonth() === month &&
          new Date().getFullYear() === year,
      });
    }

    return days;
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
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="logo">EventHub</div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </nav>

        <div className="filter-section">
          <h3 className="filter-title">Filter Events</h3>
          <div className="filters">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => applyFilter("all")}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "upcoming" ? "active" : ""
              }`}
              onClick={() => applyFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "past" ? "active" : ""
              }`}
              onClick={() => applyFilter("past")}
            >
              Past
            </button>
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Organizer</div>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-content">
          {activeTab === "dashboard" && (
            <div className="dashboard-overview">
              <h1 className="page-title">Events Overview</h1>

              <div className="dashboard-top-row">
                <div className="analytics-overview">
                  <AnalyticsPanel
                    events={events}
                    registrations={registrations}
                    fullView={activeTab === "analytics"}
                  />
                </div>

                <div className="calendar-container">
                  <div className="calendar-header">
                    <div className="month-navigation">
                      <button
                        className="prev-month"
                        onClick={() => changeMonth(-1)}
                      >
                        &lt;
                      </button>
                      <h3 className="current-month">
                        {formatMonth(currentMonth)}
                      </h3>
                      <button
                        className="next-month"
                        onClick={() => changeMonth(1)}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  <div className="calendar-grid">
                    <div className="weekdays">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>

                    <div className="days-grid">
                      {getDaysInMonth(currentMonth).map((day, index) => (
                        <div
                          key={index}
                          className={`day-cell ${
                            !day.isCurrentMonth ? "other-month" : ""
                          } ${day.isToday ? "today" : ""}`}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {events.length > 0 && (
                <div className="recent-events">
                  <div className="section-header">
                    <h2>Your Events</h2>
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
              <div className="page-header">
                <h1>Events</h1>
                <button className="create-event-btn" onClick={toggleForm}>
                  {isFormVisible ? "Cancel" : "+ Create New Event"}
                </button>
              </div>

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
                  <div className="events-count">
                    <span>{filteredEvents.length}</span> events found
                  </div>
                </div>

                <EventList
                  events={filteredEvents}
                  setSelectedEvent={handleEditEvent}
                  fetchEvents={fetchEvents}
                />
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-page">
              <div className="page-header">
                <h1>Analytics</h1>
              </div>
              <AnalyticsPanel
                fullView={true}
                events={events}
                registrations={registrations}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
