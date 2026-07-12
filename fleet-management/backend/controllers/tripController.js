const db = require("../config/db");
const { genId } = require("../utils/idgen");

exports.getTrips = (req, res) => {
  const trips = db.get("trips").value().map((t) => {
    const vehicle = db.get("vehicles").find({ id: t.vehicleId }).value();
    return { ...t, vehicleName: vehicle ? vehicle.name : "Unknown Vehicle" };
  });
  res.json(trips);
};

exports.addTrip = (req, res) => {
  const { vehicleId, origin, destination, date, status } = req.body;
  if (!vehicleId || !origin || !destination || !date) {
    return res.status(400).json({ message: "vehicleId, origin, destination and date are required." });
  }
  const trip = { id: genId("trp"), vehicleId, origin, destination, date, status: status || "Available" };
  db.get("trips").push(trip).write();
  res.status(201).json(trip);
};
