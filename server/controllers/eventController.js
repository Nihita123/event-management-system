import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  const { title, date, location } = req.body;
  const newEvent = await Event.create({
    title,
    date,
    location,
    createdBy: req.user._id,
  });
  res.status(201).json(newEvent);
};

export const getAllEvents = async (req, res) => {
  const events = await Event.find().populate("createdBy", "name");
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const updateEvent = async (req, res) => {
  const { title, date, location } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  event.title = title || event.title;
  event.date = date || event.date;
  event.location = location || event.location;
  await event.save();

  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
};
