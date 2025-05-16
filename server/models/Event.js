// Event Model
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "Other",
  },
  capacity: {
    type: Number,
    default: 100,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Add ticket price
  ticketPrice: {
    type: Number,
    default: 25, // Default ticket price
  },
  // This array is kept for backward compatibility but we'll primarily use Registration model
  registrations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // Additional event settings
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["draft", "published", "cancelled", "completed"],
    default: "published",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Event", eventSchema);
