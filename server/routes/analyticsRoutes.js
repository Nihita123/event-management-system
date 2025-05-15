// routes/analyticsRoutes.js (ES module version)
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

// Combined controller logic inside the route
router.get("/organizer", authMiddleware, async (req, res) => {
  try {
    console.log("User in request:", req.user);

    const organizerId = req.user.id;
    const events = await Event.find({ createdBy: organizerId }); // Ensure "createdBy" is the correct field
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
});

export default router;
