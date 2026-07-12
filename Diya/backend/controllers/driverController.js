/**
 * controllers/driverController.js
 * ---------------------------------
 * Contains the actual logic for every /api/drivers endpoint.
 * Routes files just map HTTP verb+path to these functions.
 */

const driversDB = require("../data/drivers");
const {
  validateNewDriver,
  checkLicenseExpiry,
  isValidTransition,
  SAFETY_STATUSES,
} = require("../models/Driver");

/**
 * GET /api/drivers
 * Returns all drivers, after applying the license-expiry check to each one
 * so the list always reflects up-to-date status.
 */
async function getAllDrivers(req, res) {
  try {
    const drivers = await driversDB.getAll();
    const withExpiryChecked = drivers.map(checkLicenseExpiry);
    res.status(200).json({ success: true, data: withExpiryChecked });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch drivers." });
  }
}

/**
 * GET /api/drivers/:id
 * Returns a single driver by id.
 */
async function getDriverById(req, res) {
  try {
    const driver = await driversDB.getById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }
    res.status(200).json({ success: true, data: checkLicenseExpiry(driver) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch driver." });
  }
}

/**
 * POST /api/drivers
 * Creates a new driver after validating required fields.
 */
async function createDriver(req, res) {
  try {
    const { valid, errors } = validateNewDriver(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    const newDriverData = {
      name: req.body.name,
      licenseNumber: req.body.licenseNumber,
      vehicleAssigned: req.body.vehicleAssigned,
      licenseExpiry: req.body.licenseExpiry,
      phone: req.body.phone,
      age: Number(req.body.age),
      safetyStatus: req.body.safetyStatus || "Safe",
      driverStatus: req.body.driverStatus || "Available",
      remarks: req.body.remarks || "",
    };

    const created = await driversDB.create(newDriverData);
    res.status(201).json({ success: true, data: checkLicenseExpiry(created) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create driver." });
  }
}

/**
 * PUT /api/drivers/:id
 * Updates general driver information (not status/safety-specific logic —
 * those go through the dedicated /status and /safety endpoints below).
 */
async function updateDriver(req, res) {
  try {
    const existing = await driversDB.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }

    // Prevent this generic endpoint from silently bypassing status transition rules
    const { driverStatus, safetyStatus, ...safeUpdates } = req.body;

    const updated = await driversDB.update(req.params.id, safeUpdates);
    res.status(200).json({ success: true, data: checkLicenseExpiry(updated) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update driver." });
  }
}

/**
 * DELETE /api/drivers/:id
 * Removes a driver from the store.
 */
async function deleteDriver(req, res) {
  try {
    const deleted = await driversDB.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }
    res.status(200).json({ success: true, message: "Driver deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete driver." });
  }
}

/**
 * PUT /api/drivers/:id/status
 * Updates a driver's operational status, enforcing the allowed transition
 * rules defined in the Driver model (e.g. Available -> On Trip -> Off Duty).
 * Body: { status: "On Trip", remarks?: "optional note" }
 * Suspending a driver (status = "Suspended") requires remarks explaining why.
 */
async function updateDriverStatus(req, res) {
  try {
    const { status, remarks } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: '"status" is required.' });
    }

    const driver = await driversDB.getById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }

    // A license-expired driver cannot change status until the issue is resolved
    const checked = checkLicenseExpiry(driver);
    if (checked.driverStatus === "License Expired") {
      return res.status(409).json({
        success: false,
        message: "Cannot change status: driver's license has expired.",
      });
    }

    if (!isValidTransition(driver.driverStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition: "${driver.driverStatus}" -> "${status}".`,
      });
    }

    // Suspension requires a reason in remarks
    if (status === "Suspended" && !remarks) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required when suspending a driver.",
      });
    }

    const updates = { driverStatus: status };
    if (remarks !== undefined) updates.remarks = remarks;
    // Reinstating from Suspended -> Available clears old suspension remarks
    if (driver.driverStatus === "Suspended" && status === "Available" && remarks === undefined) {
      updates.remarks = "";
    }

    const updated = await driversDB.update(req.params.id, updates);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update driver status." });
  }
}

/**
 * PUT /api/drivers/:id/safety
 * Updates a driver's safety rating.
 * Body: { safetyStatus: "Warning" }
 */
async function updateSafetyStatus(req, res) {
  try {
    const { safetyStatus } = req.body;
    if (!safetyStatus || !SAFETY_STATUSES.includes(safetyStatus)) {
      return res.status(400).json({
        success: false,
        message: `"safetyStatus" must be one of: ${SAFETY_STATUSES.join(", ")}`,
      });
    }

    const driver = await driversDB.getById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }

    const updated = await driversDB.update(req.params.id, { safetyStatus });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update safety status." });
  }
}

/**
 * GET /api/drivers/search?query=
 * Searches drivers by name or assigned vehicle (case-insensitive, partial match).
 */
async function searchDrivers(req, res) {
  try {
    const query = (req.query.query || "").toLowerCase().trim();
    const drivers = await driversDB.getAll();

    const results = drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(query) ||
        d.vehicleAssigned.toLowerCase().includes(query)
    );

    res.status(200).json({ success: true, data: results.map(checkLicenseExpiry) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search failed." });
  }
}

/**
 * GET /api/drivers/filter?status=
 * Filters drivers by exact driverStatus match.
 */
async function filterDrivers(req, res) {
  try {
    const status = req.query.status;
    const drivers = await driversDB.getAll();
    const checked = drivers.map(checkLicenseExpiry);

    const results = status
      ? checked.filter((d) => d.driverStatus === status)
      : checked;

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: "Filter failed." });
  }
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  updateDriverStatus,
  updateSafetyStatus,
  searchDrivers,
  filterDrivers,
};
