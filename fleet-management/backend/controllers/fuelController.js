const db = require("../config/db");
const { genId } = require("../utils/idgen");

function withVehicleName(log) {
  const vehicle = db.get("vehicles").find({ id: log.vehicleId }).value();
  return { ...log, vehicleName: vehicle ? vehicle.name : "Unknown Vehicle" };
}

exports.getFuelLogs = (req, res) => {
  const { vehicleId, q } = req.query;
  let logs = db.get("fuelLogs").value();

  if (vehicleId) logs = logs.filter((l) => l.vehicleId === vehicleId);

  logs = logs.map(withVehicleName);

  if (q) {
    const term = q.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.vehicleName.toLowerCase().includes(term) ||
        l.date.includes(term)
    );
  }

  res.json(logs.sort((a, b) => new Date(b.date) - new Date(a.date)));
};

exports.addFuelLog = (req, res) => {
  const { vehicleId, date, quantityLiters, cost, odometer } = req.body;
  if (!vehicleId || !date || !quantityLiters || !cost) {
    return res.status(400).json({ message: "vehicleId, date, quantityLiters and cost are required." });
  }

  const vehicle = db.get("vehicles").find({ id: vehicleId }).value();
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

  const log = {
    id: genId("fuel"),
    vehicleId,
    date,
    quantityLiters: Number(quantityLiters),
    cost: Number(cost),
    odometer: odometer ? Number(odometer) : null,
    createdBy: req.user.name,
  };
  db.get("fuelLogs").push(log).write();

  res.status(201).json(withVehicleName(log));
};

exports.updateFuelLog = (req, res) => {
  const { id } = req.params;
  const existing = db.get("fuelLogs").find({ id }).value();
  if (!existing) return res.status(404).json({ message: "Fuel log not found." });

  const updated = { ...existing, ...req.body, id };
  db.get("fuelLogs").find({ id }).assign(updated).write();

  res.json(withVehicleName(updated));
};

exports.deleteFuelLog = (req, res) => {
  const { id } = req.params;
  db.get("fuelLogs").remove({ id }).write();
  res.json({ message: "Fuel log deleted." });
};
