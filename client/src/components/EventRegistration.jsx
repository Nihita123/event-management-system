import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./EventRegistration.css";

export default function EventRegistration({ event, onRegistrationComplete }) {
  const { user, token } = useContext(AuthContext);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [registrationType, setRegistrationType] = useState("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!user || !token) {
    return (
      <div className="registration-login-prompt">
        <p>Please log in to register for this event.</p>
        <a href="/login" className="login-btn">
          Log In
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="registration-success">
        <div className="success-icon">✓</div>
        <h3>Registration Complete!</h3>
        <p>You have successfully registered for {event.title}.</p>
        <p>A confirmation has been sent to your email.</p>
        <button
          className="close-btn"
          onClick={() => {
            setSuccess(false);
            if (onRegistrationComplete) onRegistrationComplete();
          }}
        >
          Close
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: event._id,
            paymentMethod,
            registrationType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register for event");
      }

      setSuccess(true);
      if (onRegistrationComplete) {
        onRegistrationComplete(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-registration-container">
      <h3>Register for {event.title}</h3>

      {error && <div className="registration-error">{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-section">
          <h4>Event Details</h4>
          <div className="event-details">
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{event.time}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{event.location}</span>
            </div>
            <div className="detail-row ticket-price">
              <span className="detail-label">Ticket Price:</span>
              <span className="detail-value">${event.ticketPrice || 25}</span>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Registration Type</h4>
          <div className="registration-type-options">
            <label
              className={`registration-type-option ${
                registrationType === "online" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="registrationType"
                value="online"
                checked={registrationType === "online"}
                onChange={() => setRegistrationType("online")}
              />
              <div className="option-icon">🌐</div>
              <div className="option-label">Online</div>
              <div className="option-description">
                Register online and get your e-ticket
              </div>
            </label>

            <label
              className={`registration-type-option ${
                registrationType === "offline" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="registrationType"
                value="offline"
                checked={registrationType === "offline"}
                onChange={() => setRegistrationType("offline")}
              />
              <div className="option-icon">🏢</div>
              <div className="option-label">Offline</div>
              <div className="option-description">
                Register now, pay at the venue
              </div>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h4>Payment Method</h4>
          <div className="payment-methods">
            <label
              className={`payment-method ${
                paymentMethod === "credit_card" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={() => setPaymentMethod("credit_card")}
              />
              <div className="method-icon">💳</div>
              <div className="method-name">Credit Card</div>
            </label>

            <label
              className={`payment-method ${
                paymentMethod === "paypal" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
              />
              <div className="method-icon">🅿️</div>
              <div className="method-name">PayPal</div>
            </label>

            <label
              className={`payment-method ${
                paymentMethod === "cash" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                disabled={registrationType !== "offline"}
              />
              <div className="method-icon">💵</div>
              <div className="method-name">Cash</div>
              <div className="method-note">(Offline only)</div>
            </label>
          </div>
        </div>

        <div className="registration-summary">
          <h4>Registration Summary</h4>
          <div className="summary-details">
            <div className="summary-row">
              <span>Ticket Price:</span>
              <span>${event.ticketPrice || 25}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${event.ticketPrice || 25}</span>
            </div>
          </div>

          <div className="registration-notes">
            <p>By registering, you agree to the event terms and conditions.</p>
            {registrationType === "offline" && paymentMethod === "cash" && (
              <p className="offline-note">
                <strong>Note:</strong> Please arrive 30 minutes early to
                complete your payment at the venue.
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Processing..." : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
