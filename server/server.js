import express from "express"; // Convert to ES module import
import mongoose from "mongoose"; // Convert to ES module import
import cors from "cors"; // Convert to ES module import
import dotenv from "dotenv"; // Convert to ES module import
import eventRoutes from "./routes/events.js"; // ES module import
import authRoutes from "./routes/authRoutes.js"; // Correct import for authRoutes

import analyticsRoutes from "./routes/analyticsRoutes.js";
import registrationRoutes from "./routes/registrations.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/registrations", registrationRoutes);

// Example route
app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;

console.log("Connecting to Mongo URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
