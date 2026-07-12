const db = require("../config/db");

exports.getSummary = (req, res) => {
  const fuelLogs = db.get("fuelLogs").value();
  const maintenance = db.get("maintenance").value();
  const expenses = db.get("expenses").value();
  const vehicles = db.get("vehicles").value();

  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + Number(f.cost || 0), 0);
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + Number(m.cost || 0), 0);
  // Avoid double-counting maintenance expenses that were also logged in the expenses table
  const totalOtherExpenses = expenses
    .filter((e) => e.type !== "Maintenance")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const overallOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

  const vehicleWise = vehicles.map((v) => {
    const fuel = fuelLogs.filter((f) => f.vehicleId === v.id).reduce((s, f) => s + Number(f.cost || 0), 0);
    const maint = maintenance.filter((m) => m.vehicleId === v.id).reduce((s, m) => s + Number(m.cost || 0), 0);
    const other = expenses
      .filter((e) => e.vehicleId === v.id && e.type !== "Maintenance")
      .reduce((s, e) => s + Number(e.amount || 0), 0);
    return {
      vehicleId: v.id,
      vehicleName: v.name,
      fuelCost: fuel,
      maintenanceCost: maint,
      otherExpenses: other,
      totalCost: fuel + maint + other,
    };
  });

  res.json({
    totalFuelCost,
    totalMaintenanceCost,
    totalOtherExpenses,
    overallOperationalCost,
    vehicleWise,
    fuelBudgetThreshold: Number(process.env.FUEL_BUDGET_THRESHOLD || 50000),
    maintenanceHighThreshold: Number(process.env.MAINTENANCE_HIGH_THRESHOLD || 20000),
    fuelBudgetExceeded: totalFuelCost > Number(process.env.FUEL_BUDGET_THRESHOLD || 50000),
  });
};
