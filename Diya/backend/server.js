/**
 * server.js
 * ----------
 * Entry point for the Express backend.
 * Sets up middleware, mounts routes, and starts the server.
 */

const express = require("express");
const cors = require("cors");
const driverRoutes = require("./routes/driverRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allow the React frontend (different port) to call this API
app.use(express.json()); // parse incoming JSON request bodies

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Driver Safety API is running." });
});

// Mount driver routes under /api/drivers
app.use("/api/drivers", driverRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Generic error handler (catches unexpected errors thrown in middleware/routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Driver Safety API running on http://localhost:${PORT}`);
});
