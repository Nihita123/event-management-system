const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "organizer", "attendee"],
    default: "attendee",
  },
});

module.exports = mongoose.model("User", UserSchema);
