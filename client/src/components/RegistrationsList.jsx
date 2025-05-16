import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./RegistrationsList.css";

export default function RegistrationsList({ eventId = null }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        let url = eventId
          ? `http://localhost:5000/api/registrations/event/${eventId}`
          : "http://localhost:5000/api/registrations/my-registrations";

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRegistrations();
    }
  }, [token, eventId]);

  const handleMarkAttended = async (registrationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/attended`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark attendance");
      }

      // Update registration in state
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg._id === registrationId ? { ...reg, status: "attended" } : reg
        )
      );
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Error marking attendance: " + err.message);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel this registration?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to cancel registration");
      }

      // Update registration in state
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg._id === registrationId
            ? {
                ...reg,
                status: "cancelled",
                paymentStatus:
                  reg.paymentStatus === "completed"
                    ? "refunded"
                    : reg.paymentStatus,
              }
            : reg
        )
      );
    } catch (err) {
      console.error("Error cancelling registration:", err);
      alert("Error cancelling registration: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="registrations-loading">Loading registrations...</div>
    );
  }

  if (error) {
    return <div className="registrations-error">Error: {error}</div>;
  }

  if (registrations.length === 0) {
    return (
      <div className="no-registrations">
        <div className="empty-state-icon">🎫</div>
        <h3>No registrations found</h3>
        <p>
          {eventId
            ? "No one has registered for this event yet."
            : "You don't have any registrations yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="registrations-container">
      <h3 className="registrations-title">
        {eventId ? "Event Registrations" : "All Registrations"}
      </h3>

      <div className="registrations-stats">
        <div className="stat-item">
          <span className="stat-value">{registrations.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {registrations.filter((r) => r.status === "attended").length}
          </span>
          <span className="stat-label">Attended</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {registrations.filter((r) => r.status === "cancelled").length}
          </span>
          <span className="stat-label">Cancelled</span>
        </div>
      </div>

      <div className="table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Attendee</th>
              <th>Event</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr
                key={registration._id}
                className={`status-${registration.status}`}
              >
                <td className="attendee-cell">
                  <div className="attendee-name">
                    {registration.user?.name || "Unknown"}
                  </div>
                  <div className="attendee-email">
                    {registration.user?.email || ""}
                  </div>
                </td>
                <td>{registration.event?.title || "Unknown Event"}</td>
                <td>{formatDate(registration.timestamp)}</td>
                <td>
                  <span className={`status-badge ${registration.status}`}>
                    {registration.status.charAt(0).toUpperCase() +
                      registration.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="payment-info">
                    <span
                      className={`payment-status ${registration.paymentStatus}`}
                    >
                      {registration.paymentStatus}
                    </span>
                    <span className="payment-amount">
                      ${registration.paymentAmount}
                    </span>
                  </div>
                </td>
                <td className="registration-type">
                  {registration.registrationType || "online"}
                </td>
                <td className="actions-cell">
                  {registration.status !== "attended" && (
                    <button
                      className="action-btn attend-btn"
                      onClick={() => handleMarkAttended(registration._id)}
                      disabled={registration.status === "cancelled"}
                    >
                      <i className="fa-solid fa-check"></i> Mark Attended
                    </button>
                  )}
                  {registration.status !== "cancelled" && (
                    <button
                      className="action-btn cancel-btn"
                      onClick={() => handleCancelRegistration(registration._id)}
                    >
                      <i className="fa-solid fa-times"></i> Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
