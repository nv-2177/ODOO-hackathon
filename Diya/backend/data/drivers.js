/**
 * data/drivers.js
 * -----------------
 * In-memory "database" for drivers.
 *
 * WHY THIS FILE EXISTS:
 * Instead of exporting a raw array and letting controllers mutate it directly,
 * we expose small async CRUD functions (getAll, getById, create, update, remove).
 * This keeps the storage layer isolated — later, swapping this file's internals
 * for MongoDB/Postgres queries will NOT require changing any controller code,
 * because controllers only ever call these functions, never touch the array directly.
 */

// Seed data — a few sample drivers so the API is testable immediately
let drivers = [
  {
    id: 1,
    name: "Ravi Kumar",
    licenseNumber: "TN01-20230001234",
    vehicleAssigned: "TN09AB1234",
    licenseExpiry: "2027-01-15",
    phone: "9876543210",
    age: 34,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 2,
    name: "Suresh Babu",
    licenseNumber: "TN02-20210005678",
    vehicleAssigned: "TN10CD5678",
    licenseExpiry: "2024-05-10",
    phone: "9876500000",
    age: 41,
    safetyStatus: "Warning",
    driverStatus: "On Trip",
    remarks: ""
  },
  {
    id: 3,
    name: "Anitha Raj",
    licenseNumber: "TN03-20220009876",
    vehicleAssigned: "TN11EF9012",
    licenseExpiry: "2026-12-31",
    phone: "9998887776",
    age: 29,
    safetyStatus: "Safe",
    driverStatus: "Off Duty",
    remarks: ""
  },
  {
    id: 4,
    name: "Arun Kumar",
    licenseNumber: "TN04-20230001111",
    vehicleAssigned: "TN12AA1111",
    licenseExpiry: "2028-03-18",
    phone: "9000000001",
    age: 32,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 5,
    name: "Karthik R",
    licenseNumber: "TN05-20230002222",
    vehicleAssigned: "TN13BB2222",
    licenseExpiry: "2027-08-22",
    phone: "9000000002",
    age: 36,
    safetyStatus: "Safe",
    driverStatus: "On Trip",
    remarks: ""
  },
  {
    id: 6,
    name: "Prakash M",
    licenseNumber: "TN06-20210003333",
    vehicleAssigned: "TN14CC3333",
    licenseExpiry: "2023-11-15",
    phone: "9000000003",
    age: 45,
    safetyStatus: "Danger",
    driverStatus: "License Expired",
    remarks: "License expired."
  },
  {
    id: 7,
    name: "Vignesh S",
    licenseNumber: "TN07-20220004444",
    vehicleAssigned: "TN15DD4444",
    licenseExpiry: "2028-06-10",
    phone: "9000000004",
    age: 30,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 8,
    name: "Deepak Raj",
    licenseNumber: "TN08-20200005555",
    vehicleAssigned: "TN16EE5555",
    licenseExpiry: "2026-02-18",
    phone: "9000000005",
    age: 39,
    safetyStatus: "Warning",
    driverStatus: "Off Duty",
    remarks: "Medical check pending."
  },
  {
    id: 9,
    name: "Hari Prasad",
    licenseNumber: "TN09-20230006666",
    vehicleAssigned: "TN17FF6666",
    licenseExpiry: "2029-04-20",
    phone: "9000000006",
    age: 28,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 10,
    name: "Lokesh Kumar",
    licenseNumber: "TN10-20210007777",
    vehicleAssigned: "TN18GG7777",
    licenseExpiry: "2025-01-01",
    phone: "9000000007",
    age: 43,
    safetyStatus: "Warning",
    driverStatus: "License Expired",
    remarks: "Renew immediately."
  },
  {
    id: 11,
    name: "Mohan Raj",
    licenseNumber: "TN11-20230008888",
    vehicleAssigned: "TN19HH8888",
    licenseExpiry: "2028-10-12",
    phone: "9000000008",
    age: 35,
    safetyStatus: "Safe",
    driverStatus: "On Trip",
    remarks: ""
  },
  {
    id: 12,
    name: "Naveen Kumar",
    licenseNumber: "TN12-20220009999",
    vehicleAssigned: "TN20JJ9999",
    licenseExpiry: "2029-07-30",
    phone: "9000000009",
    age: 27,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 13,
    name: "Pradeep Kumar",
    licenseNumber: "TN13-20210001234",
    vehicleAssigned: "TN21KK1111",
    licenseExpiry: "2027-12-15",
    phone: "9000000010",
    age: 38,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 14,
    name: "Rahul Sharma",
    licenseNumber: "TN14-20200002345",
    vehicleAssigned: "TN22LL2222",
    licenseExpiry: "2026-09-14",
    phone: "9000000011",
    age: 31,
    safetyStatus: "Warning",
    driverStatus: "On Trip",
    remarks: ""
  },
  {
    id: 15,
    name: "Senthil Kumar",
    licenseNumber: "TN15-20220003456",
    vehicleAssigned: "TN23MM3333",
    licenseExpiry: "2028-11-05",
    phone: "9000000012",
    age: 33,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 16,
    name: "Balaji M",
    licenseNumber: "TN16-20210004567",
    vehicleAssigned: "TN24NN4444",
    licenseExpiry: "2024-06-12",
    phone: "9000000013",
    age: 46,
    safetyStatus: "Danger",
    driverStatus: "License Expired",
    remarks: "Expired."
  },
  {
    id: 17,
    name: "Saravanan P",
    licenseNumber: "TN17-20230005678",
    vehicleAssigned: "TN25PP5555",
    licenseExpiry: "2029-09-19",
    phone: "9000000014",
    age: 29,
    safetyStatus: "Safe",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 18,
    name: "Sathish Kumar",
    licenseNumber: "TN18-20230006789",
    vehicleAssigned: "TN26QQ6666",
    licenseExpiry: "2028-08-17",
    phone: "9000000015",
    age: 34,
    safetyStatus: "Safe",
    driverStatus: "Off Duty",
    remarks: ""
  },
  {
    id: 19,
    name: "Vinoth Raj",
    licenseNumber: "TN19-20210007890",
    vehicleAssigned: "TN27RR7777",
    licenseExpiry: "2027-05-23",
    phone: "9000000016",
    age: 37,
    safetyStatus: "Warning",
    driverStatus: "Available",
    remarks: ""
  },
  {
    id: 20,
    name: "Yuvaraj S",
    licenseNumber: "TN20-20230008901",
    vehicleAssigned: "TN28SS8888",
    licenseExpiry: "2030-01-10",
    phone: "9000000017",
    age: 26,
    safetyStatus: "Safe",
    driverStatus: "On Trip",
    remarks: ""
  }

];

// Simple auto-incrementing id counter for new drivers
let nextId = 21;

/**
 * Simulates async DB latency so the rest of the codebase can genuinely use
 * async/await (and so swapping in a real DB later doesn't change call sites).
 */
const simulateDelay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 10));

/** Get all drivers */
async function getAll() {
  return simulateDelay([...drivers]);
}

/** Get a single driver by id (returns undefined if not found) */
async function getById(id) {
  const driver = drivers.find((d) => d.id === Number(id));
  return simulateDelay(driver);
}

/** Create a new driver and add it to the store */
async function create(driverData) {
  const newDriver = {
    id: nextId++,
    ...driverData,
  };
  drivers.push(newDriver);
  return simulateDelay(newDriver);
}

/** Update an existing driver by id with partial fields. Returns updated driver or null. */
async function update(id, updates) {
  const index = drivers.findIndex((d) => d.id === Number(id));
  if (index === -1) return simulateDelay(null);

  drivers[index] = { ...drivers[index], ...updates };
  return simulateDelay(drivers[index]);
}

/** Delete a driver by id. Returns true if deleted, false if not found. */
async function remove(id) {
  const index = drivers.findIndex((d) => d.id === Number(id));
  if (index === -1) return simulateDelay(false);

  drivers.splice(index, 1);
  return simulateDelay(true);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
