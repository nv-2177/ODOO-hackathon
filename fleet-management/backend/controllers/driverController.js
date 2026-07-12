const db = require("../config/db");
const { genId } = require("../utils/idgen");

exports.getDrivers = (req, res) => res.json(db.get("drivers").value());

exports.addDriver = (req, res) => {
  const { name, phone, licenseNo } = req.body;
  if (!name) return res.status(400).json({ message: "Driver name is required." });
  const driver = { id: genId("drv"), name, phone: phone || "", licenseNo: licenseNo || "" };
  db.get("drivers").push(driver).write();
  res.status(201).json(driver);
};
