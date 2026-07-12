const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const adapter = new FileSync(path.join(__dirname, "..", "data", "db.json"));
const db = low(adapter);

// Ensure default shape exists
db.defaults({
  users: [],
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  fuelLogs: [],
  expenses: [],
}).write();

module.exports = db;
