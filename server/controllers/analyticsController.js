const Event = require("../models/Event");
const Registration = require("../models/Registration"); // Assuming you store event registrations here

exports.getEventAnalytics = async (req, res) => {
  try {
    console.log("User in request:", req.user); // ✅ Safe here

    const organizerId = req.user.id;
    const events = await Event.find({ organizer: organizerId });
    console.log("Events fetched:", events);

    const analytics = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await Registration.countDocuments({
          event: event._id,
        });
        return {
          title: event.title,
          date: event.date,
          attendees: attendeeCount,
        };
      })
    );

    res.json({ totalEvents: events.length, analytics });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};
