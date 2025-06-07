import mongoose from "mongoose";
const guestSchema = new mongoose.Schema(
  {
    name: String,
    type: { type: String, enum: ["existing", "prospect", "staff"] },
    AUM: Number,
    revenue: Number,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("Guest", guestSchema);
