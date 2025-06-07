import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
  {
    title: String,
    date: Date,
    location: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("Event", eventSchema);
