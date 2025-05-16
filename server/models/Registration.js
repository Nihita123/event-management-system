import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "attended", "cancelled"],
    default: "registered",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // New fields for payment tracking
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  paymentAmount: {
    type: Number,
    required: true,
    default: 25, // Default ticket price
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "cash", "other"],
    default: "other",
  },
  registrationType: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  // Reference to payment transaction (if implementing a payment system)
  paymentTransaction: {
    type: String,
    default: null,
  },
});

// Add index for faster queries
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
