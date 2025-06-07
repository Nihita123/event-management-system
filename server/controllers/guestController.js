import Guest from "../models/Guest.js";

export const addGuest = async (req, res) => {
  const guest = await Guest.create({ ...req.body, submittedBy: req.user._id });
  res.status(201).json(guest);
};

export const getGuestsByEvent = async (req, res) => {
  const guests = await Guest.find({ eventId: req.params.eventId });
  res.json(guests);
};

export const updateGuest = async (req, res) => {
  const guest = await Guest.findById(req.params.id);
  if (!guest) return res.status(404).json({ message: "Guest not found" });

  Object.assign(guest, req.body);
  await guest.save();
  res.json(guest);
};

export const deleteGuest = async (req, res) => {
  const guest = await Guest.findByIdAndDelete(req.params.id);
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  res.json({ message: "Guest deleted" });
};

export const approveGuest = async (req, res) => {
  const guest = await Guest.findById(req.params.id);
  if (!guest) return res.status(404).json({ message: "Guest not found" });
  guest.approved = true;
  guest.approvedBy = req.user._id;
  await guest.save();
  res.json({ message: "Guest approved" });
};
