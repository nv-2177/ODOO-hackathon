const db = require("../config/db");
const { genId } = require("../utils/idgen");

exports.getVehicles = (req, res) => {
  res.json(db.get("vehicles").value());
};

exports.addVehicle = (req, res) => {
  const { name, regNo, type } = req.body;
  if (!name || !regNo) {
    return res.status(400).json({ message: "Vehicle name and registration number are required." });
  }
  const vehicle = { id: genId("veh"), name, regNo, type: type || "General" };
  db.get("vehicles").push(vehicle).write();
  res.status(201).json(vehicle);
};
