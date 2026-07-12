const db = require("../config/db");
const { genId } = require("../utils/idgen");

exports.getMaintenance = (req, res) => {
  const records = db.get("maintenance").value().map((m) => {
    const vehicle = db.get("vehicles").find({ id: m.vehicleId }).value();
    return { ...m, vehicleName: vehicle ? vehicle.name : "Unknown Vehicle" };
  });
  res.json(records);
};

exports.addMaintenance = (req, res) => {
  const { vehicleId, description, cost, date } = req.body;
  if (!vehicleId || !cost || !date) {
    return res.status(400).json({ message: "vehicleId, cost and date are required." });
  }
  const record = { id: genId("mnt"), vehicleId, description: description || "", cost: Number(cost), date };
  db.get("maintenance").push(record).write();
  res.status(201).json(record);
};
