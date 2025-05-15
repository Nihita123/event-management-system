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
});

export default mongoose.model("Registration", registrationSchema);
