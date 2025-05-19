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
  const [activeTab, setActiveTab] = useState("account");
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
      const today = new Date();
      const isToday =
        today.getDate() === i &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      // Add special markers for certain dates (as shown in the image)
      // Here 19 is highlighted (current date), and 27, 28, 29 have dots

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: isToday,

        isHighlighted: i === 19, // Current date in image
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
      {/* Top Navigation Header */}
      <header className="dashboard-header">
        {/* Left side - Logo and Brand */}
        <div className="header-brand">
          <div className="brand-logo">Q</div>
          <div className="brand-name">Productions</div>
        </div>

        {/* Center - Main Navigation */}
        <nav className="main-navigation"></nav>

        {/* Right side - User and Social */}
        <div className="header-actions">
          <ul>
            <li>
              <button>Home</button>
            </li>
            <li>
              <button>Log Out</button>
            </li>
          </ul>
        </div>
      </header>

      {/* User Profile Bar */}
      <div className="profile-bar-container">
        <div className="profile-bar">
          <div className="profile-content">
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <div className="avatar-placeholder"></div>
              )}
            </div>
            <div className="profile-info">
              <div className="name-admin-wrapper">
                <h3 className="user-name">{user.name}</h3>
                {user.isAdmin && <span className="admin-badge">Admin</span>}
              </div>
              <div className="follow-stats">
                <span>{user.email} </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className="secondary-navigation">
        <ul>
          <li>
            <button
              className={activeTab === "account" ? "active" : ""}
              onClick={() => setActiveTab("account")}
            >
              My Account
            </button>
          </li>
          <li>
            <button
              className={activeTab === "events" ? "active" : ""}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
          </li>
          <li>
            <button
              className={activeTab === "Analytics" ? "active" : ""}
              onClick={() => setActiveTab("Analytics")}
            >
              Analytics
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="dashboard-main-content">
        {/* Filter Section - Only shown for Events tab */}
        {activeTab === "events" && (
          <div className="events-header-container">
            <div className="event-filter-tabs">
              <button
                className={`filter-tab ${
                  activeFilter === "upcoming" ? "active" : ""
                }`}
                onClick={() => applyFilter("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`filter-tab ${
                  activeFilter === "past" ? "active" : ""
                }`}
                onClick={() => applyFilter("past")}
              >
                Past
              </button>
            </div>
          </div>
        )}

        {/* Show dashboard content for My Account tab */}
        {activeTab === "account" && (
          <div className="dashboard-overview">
            <div className="dashboard-top-row">
              <div className="analytics-overview">
                <AnalyticsPanel
                  events={events}
                  registrations={registrations}
                  fullView={activeTab === "analytics"}
                />
              </div>

              <div className="calendar-container dark-theme">
                <div className="calendar-header">
                  <div className="month-navigation">
                    <button
                      className="prev-month"
                      onClick={() => changeMonth(-1)}
                    >
                      &lt;
                    </button>
                    <h3 className="current-month">May 2025</h3>
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
                        } ${day.isToday ? "today" : ""} ${
                          day.isHighlighted ? "highlighted" : ""
                        }`}
                      >
                        {day.day}
                        {day.hasMarker && (
                          <span className="event-marker"></span>
                        )}
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

        {activeTab === "Analytics" && (
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

        {/* Empty placeholder for profile tab */}
        {activeTab === "profile" && (
          <div className="profile-page">
            <h1>Profile</h1>
            <p>User profile information and settings would appear here.</p>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="wallet-page">
            <h1>My Wallet</h1>
            <p>Wallet information and transaction history would appear here.</p>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bookings-page">
            <h1>My Bookings</h1>
            <p>Booking information and history would appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
