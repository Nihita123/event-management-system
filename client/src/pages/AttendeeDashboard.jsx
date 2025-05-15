import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const AttendeeDashboard = () => {
  const { user, token } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegisteredEvents = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/events/my-registrations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const registeredIds = data.map((event) => event._id);
        setRegisteredEvents(registeredIds);
      } catch (err) {
        console.error("Error fetching registered events", err);
      }
    };

    if (token) {
      fetchEvents();
      fetchRegisteredEvents();
    }
  }, [token]);

  const handleRegister = async (eventId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      alert("Successfully registered!");
      setRegisteredEvents([...registeredEvents, eventId]);
    } catch (err) {
      alert(err.message);
    }
  };

  const isAlreadyRegistered = (eventId) => registeredEvents.includes(eventId);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Attendee Dashboard</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event._id} className="border p-4 rounded shadow-sm">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(event.date).toLocaleString()}
              </p>
              <button
                onClick={() => handleRegister(event._id)}
                className={`mt-2 px-3 py-1 rounded ${
                  isAlreadyRegistered(event._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={isAlreadyRegistered(event._id)}
              >
                {isAlreadyRegistered(event._id) ? "Registered" : "Register"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendeeDashboard;
