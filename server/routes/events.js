// Event Routes
import express from "express";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all events (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all events by organizer
router.get("/my-events", verifyToken, async (req, res) => {
  try {
    // Find events and include registration counts
    const events = await Event.find({ createdBy: req.user.id });

    // Fetch registration counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrations = await Registration.find({
          event: event._id,
        });

        // Calculate event statistics
        const attendeeCount = registrations.length;
        const revenue = registrations.reduce(
          (sum, reg) => sum + (reg.paymentAmount || 0),
          0
        );
        const onlineRegistrations = registrations.filter(
          (reg) => reg.registrationType === "online"
        ).length;
        const offlineRegistrations = registrations.filter(
          (reg) => reg.registrationType === "offline"
        ).length;

        // Calculate weekly sales data
        const weeklySales = Array(7).fill(0);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        registrations.forEach((reg) => {
          if (reg.timestamp > oneWeekAgo) {
            const dayOfWeek = new Date(reg.timestamp).getDay();
            weeklySales[dayOfWeek]++;
          }
        });

        // Return event with additional statistics
        return {
          ...event.toObject(),
          attendees: attendeeCount,
          revenue: revenue,
          onlineSales: onlineRegistrations,
          offlineSales: offlineRegistrations,
          weeklySales: weeklySales,
          weeklyTotalSales: weeklySales.reduce((a, b) => a + b, 0),
        };
      })
    );

    res.json(eventsWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE event (Organizer only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({ error: "Access Denied" });
    }
    const event = new Event({
      ...req.body,
      createdBy: req.user.id,
      ticketPrice: req.body.ticketPrice || 25, // Default ticket price if not specified
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register for an event (Client)
router.post("/:id/register", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const userId = req.user.id;
    const { paymentMethod, registrationType = "online" } = req.body;

    // Prevent duplicate registrations
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: event._id,
    });

    if (existingRegistration) {
      return res.status(400).json({ error: "Already registered" });
    }

    // Process payment (simplified version)
    const ticketPrice = event.ticketPrice || 25; // Default price if not set
    let paymentStatus = "pending";

    if (paymentMethod === "credit_card" || paymentMethod === "paypal") {
      // In a real app, you would integrate with payment gateway here
      paymentStatus = "completed";
    }

    // Create registration record
    const registration = new Registration({
      user: userId,
      event: event._id,
      status: "registered",
      paymentStatus,
      paymentAmount: ticketPrice,
      paymentMethod,
      registrationType,
    });

    await registration.save();

    res.status(200).json({
      message: "Registered successfully",
      registration,
      paymentAmount: ticketPrice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get events the user has registered for
router.get("/my-registrations", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.find({ user: userId }).populate(
      "event"
    );
    const registeredEvents = registrations.map((reg) => reg.event);

    res.status(200).json(registeredEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
