/**
 * Seeds data/db.json with demo users, vehicles, drivers, trips,
 * maintenance records, fuel logs and expenses.
 * Run with: npm run seed
 */
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { genId } = require("./idgen");

const hash = (pwd) => bcrypt.hashSync(pwd, 8);

function seed() {
  db.set("users", [
    {
      id: genId("usr"),
      name: "Arjun Mehta",
      email: "admin@fleet.com",
      password: hash("admin123"),
      role: "Admin",
    },
    {
      id: genId("usr"),
      name: "Priya Nair",
      email: "dispatcher@fleet.com",
      password: hash("dispatch123"),
      role: "Dispatcher",
    },
    {
      id: genId("usr"),
      name: "Karthik Raja",
      email: "manager@fleet.com",
      password: hash("manager123"),
      role: "Manager",
    },
  ]).write();

  const vehicles = [
    { id: genId("veh"), name: "Tata Ace - TN01AB1234", regNo: "TN01AB1234", type: "Mini Truck" },
    { id: genId("veh"), name: "Ashok Leyland - TN22CD5678", regNo: "TN22CD5678", type: "Truck" },
    { id: genId("veh"), name: "Mahindra Bolero - TN09EF9012", regNo: "TN09EF9012", type: "Pickup" },
    { id: genId("veh"), name: "Eicher Pro - TN37GH3456", regNo: "TN37GH3456", type: "Truck" },
  ];
  db.set("vehicles", vehicles).write();

  const drivers = [
    { id: genId("drv"), name: "Suresh Kumar", phone: "9876543210", licenseNo: "TN0120230001" },
    { id: genId("drv"), name: "Ramesh Babu", phone: "9876543211", licenseNo: "TN0120230002" },
  ];
  db.set("drivers", drivers).write();

  const trips = [
    { id: genId("trp"), vehicleId: vehicles[0].id, origin: "Chennai", destination: "Bengaluru", date: "2026-07-01", status: "Completed" },
    { id: genId("trp"), vehicleId: vehicles[1].id, origin: "Chennai", destination: "Coimbatore", date: "2026-07-05", status: "Completed" },
    { id: genId("trp"), vehicleId: vehicles[2].id, origin: "Chennai", destination: "Madurai", date: "2026-07-10", status: "Available" },
  ];
  db.set("trips", trips).write();

  const maintenance = [
    { id: genId("mnt"), vehicleId: vehicles[0].id, description: "Engine oil change", cost: 3500, date: "2026-06-20" },
    { id: genId("mnt"), vehicleId: vehicles[1].id, description: "Tyre replacement", cost: 22000, date: "2026-06-25" },
  ];
  db.set("maintenance", maintenance).write();

  const fuelLogs = [
    { id: genId("fuel"), vehicleId: vehicles[0].id, date: "2026-07-01", quantityLiters: 40, cost: 4200, odometer: 45210, createdBy: "Priya Nair" },
    { id: genId("fuel"), vehicleId: vehicles[1].id, date: "2026-07-05", quantityLiters: 80, cost: 8600, odometer: 98120, createdBy: "Priya Nair" },
    { id: genId("fuel"), vehicleId: vehicles[2].id, date: "2026-07-09", quantityLiters: 35, cost: 3750, odometer: 21050, createdBy: "Priya Nair" },
  ];
  db.set("fuelLogs", fuelLogs).write();

  const expenses = [
    { id: genId("exp"), type: "Toll", vehicleId: vehicles[0].id, tripId: trips[0].id, amount: 450, date: "2026-07-01", status: "Completed", description: "NH48 toll charges" },
    { id: genId("exp"), type: "Miscellaneous", vehicleId: vehicles[1].id, tripId: trips[1].id, amount: 800, date: "2026-07-05", status: "Available", description: "Driver food & lodging" },
    { id: genId("exp"), type: "Maintenance", vehicleId: vehicles[1].id, tripId: null, amount: 22000, date: "2026-06-25", status: "Completed", description: "Linked maintenance expense - tyre replacement" },
  ];
  db.set("expenses", expenses).write();

  console.log("✅ Database seeded successfully.");
  console.log("   Admin login:      admin@fleet.com / admin123");
  console.log("   Dispatcher login: dispatcher@fleet.com / dispatch123");
  console.log("   Manager login:    manager@fleet.com / manager123");
}

seed();
