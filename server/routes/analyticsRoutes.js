import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

const router = express.Router();

router.get("/organizer", authMiddleware, async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ createdBy: organizerId });
    const totalEvents = events.length;

    let totalRegistrations = 0;
    let weeklySales = Array(7).fill(0); // [0, 0, ..., 0]
    const today = new Date();

    const analytics = await Promise.all(
      events.map(async (event) => {
        const eventRegistrations = await Registration.find({
          event: event._id,
        });
        const attendeeCount = eventRegistrations.length;

        // Count weekly sales: last 7 days
        eventRegistrations.forEach((reg) => {
          const diffInDays = Math.floor(
            (today - new Date(reg.timestamp)) / (1000 * 60 * 60 * 24)
          );
          if (diffInDays >= 0 && diffInDays < 7) {
            weeklySales[6 - diffInDays] += 100; // assume each ticket = ₹100
          }
        });

        totalRegistrations += attendeeCount;

        return {
          title: event.title,
          date: event.date,
          attendees: attendeeCount,
        };
      })
    );

    const totalSales = totalRegistrations * 100;
    const weeklyTotalSales = weeklySales.reduce((a, b) => a + b, 0);

    // Assume 70% tickets sold online, 30% offline for mock `ticketProgress`
    const ticketProgress = {
      online: 70,
      offline: 30,
    };

    res.json({
      totalEvents,
      totalSales,
      totalRegistrations,
      weeklySales,
      weeklyTotalSales,
      ticketProgress,
      analytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;
