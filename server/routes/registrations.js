import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all registrations for events created by the logged-in organizer
router.get("/my-registrations", verifyToken, async (req, res) => {
  try {
    // Find all events created by this organizer
    const events = await Event.find({ createdBy: req.user.id }).select("_id");

    // Get registrations for these events
    const registrations = await Registration.find({
      event: { $in: events.map((e) => e._id) },
    })
      .populate("user", "name email")
      .populate("event", "title date ticketPrice");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations for a specific event
router.get("/event/:eventId", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    // Check if the user is the event organizer
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get registrations for a user
router.get("/user", verifyToken, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: "event",
        select: "title date location description imageUrl ticketPrice",
      })
      .sort({ timestamp: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register for an event
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { eventId, paymentMethod, registrationType = "online" } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Prevent duplicate registrations
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId,
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ error: "Already registered for this event" });
    }

    // Check if event has reached capacity
    const currentRegistrations = await Registration.countDocuments({
      event: eventId,
    });
    if (event.capacity && currentRegistrations >= event.capacity) {
      return res
        .status(400)
        .json({ error: "Event has reached maximum capacity" });
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
      user: req.user.id,
      event: eventId,
      status: "registered",
      paymentStatus,
      paymentAmount: ticketPrice,
      paymentMethod,
      registrationType,
      timestamp: new Date(), // Ensure timestamp is set to now
    });

    await registration.save();

    // Also add to legacy registrations array on event
    event.registrations.push(req.user.id);
    await event.save();

    res.status(200).json({
      message: "Registered successfully",
      registration,
      paymentAmount: ticketPrice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark registration as attended
router.put("/:id/attended", verifyToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate(
      "event"
    );

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // Check if user is the event organizer
    const event = registration.event;
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    registration.status = "attended";
    await registration.save();

    res.json({ message: "Status updated to attended", registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel registration
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // Check if the user owns this registration or is the event organizer
    const event = await Event.findById(registration.event);
    if (
      registration.user.toString() !== req.user.id &&
      event.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    registration.status = "cancelled";

    // If payment was completed, mark as refunded
    if (registration.paymentStatus === "completed") {
      registration.paymentStatus = "refunded";
    }

    await registration.save();

    // Remove from legacy registrations array on event
    if (event.registrations.includes(registration.user)) {
      event.registrations = event.registrations.filter(
        (userId) => userId.toString() !== registration.user.toString()
      );
      await event.save();
    }

    res.json({ message: "Registration cancelled", registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
