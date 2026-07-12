const db = require("../config/db");
const { genId } = require("../utils/idgen");

function enrich(expense) {
  const vehicle = db.get("vehicles").find({ id: expense.vehicleId }).value();
  const trip = expense.tripId ? db.get("trips").find({ id: expense.tripId }).value() : null;
  return {
    ...expense,
    vehicleName: vehicle ? vehicle.name : "Unknown Vehicle",
    tripLabel: trip ? `${trip.origin} → ${trip.destination}` : null,
  };
}

exports.getExpenses = (req, res) => {
  const { vehicleId, tripId, type, q } = req.query;
  let expenses = db.get("expenses").value();

  if (vehicleId) expenses = expenses.filter((e) => e.vehicleId === vehicleId);
  if (tripId) expenses = expenses.filter((e) => e.tripId === tripId);
  if (type) expenses = expenses.filter((e) => e.type === type);

  expenses = expenses.map(enrich);

  if (q) {
    const term = q.toLowerCase();
    expenses = expenses.filter(
      (e) =>
        e.vehicleName.toLowerCase().includes(term) ||
        (e.description || "").toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term)
    );
  }

  res.json(expenses.sort((a, b) => new Date(b.date) - new Date(a.date)));
};

exports.addExpense = (req, res) => {
  const { type, vehicleId, tripId, amount, date, description, status } = req.body;
  if (!type || !vehicleId || !amount || !date) {
    return res.status(400).json({ message: "type, vehicleId, amount and date are required." });
  }

  const expense = {
    id: genId("exp"),
    type,
    vehicleId,
    tripId: tripId || null,
    amount: Number(amount),
    date,
    description: description || "",
    status: status || "Available",
  };
  db.get("expenses").push(expense).write();

  res.status(201).json(enrich(expense));
};

exports.updateExpense = (req, res) => {
  const { id } = req.params;
  const existing = db.get("expenses").find({ id }).value();
  if (!existing) return res.status(404).json({ message: "Expense not found." });

  const updated = { ...existing, ...req.body, id };
  db.get("expenses").find({ id }).assign(updated).write();

  res.json(enrich(updated));
};

exports.deleteExpense = (req, res) => {
  const { id } = req.params;
  db.get("expenses").remove({ id }).write();
  res.json({ message: "Expense deleted." });
};
