const db = require("../config/db");

exports.globalSearch = (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ vehicles: [], fuelLogs: [], expenses: [], trips: [] });

  const vehicles = db.get("vehicles").value().filter((v) =>
    v.name.toLowerCase().includes(q) || v.regNo.toLowerCase().includes(q)
  );

  const vehicleIds = new Set(vehicles.map((v) => v.id));

  const fuelLogs = db.get("fuelLogs").value().filter(
    (f) => vehicleIds.has(f.vehicleId) || f.date.includes(q)
  );

  const expenses = db.get("expenses").value().filter(
    (e) =>
      vehicleIds.has(e.vehicleId) ||
      e.type.toLowerCase().includes(q) ||
      (e.description || "").toLowerCase().includes(q)
  );

  const trips = db.get("trips").value().filter(
    (t) =>
      vehicleIds.has(t.vehicleId) ||
      t.origin.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q)
  );

  res.json({ vehicles, fuelLogs, expenses, trips });
};
