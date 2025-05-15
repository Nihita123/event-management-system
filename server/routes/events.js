import express from "express";
import Event from "../models/Event.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET all events (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET all events by organizer
router.get("/my-events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE event (Organizer only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json("Access Denied");
    }
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE event
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json("Not authorized");
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE event
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.createdBy.toString() !== req.user.id) {
      return res.status(403).json("Not authorized");
    }
    await Event.findByIdAndDelete(req.params.id);
    res.json("Event deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Register for an event (Client)
router.post("/:id/register", verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json("Event not found");

    const userId = req.user.id;

    // Prevent duplicate registrations
    if (event.registrations.includes(userId)) {
      return res.status(400).json("Already registered");
    }

    event.registrations.push(userId);
    await event.save();

    res.status(200).json("Registered successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get events the user has registered for
router.get("/my-registrations", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const registeredEvents = await Event.find({ registrations: userId });
    res.status(200).json(registeredEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
