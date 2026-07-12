/**
 * routes/driverRoutes.js
 * ------------------------
 * Defines all /api/drivers routes and wires them to controller functions.
 * NOTE: /search and /filter are declared BEFORE /:id so Express doesn't
 * mistake "search" or "filter" for an :id parameter.
 */

const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

// Search & filter (must come before "/:id" routes)
router.get("/search", driverController.searchDrivers);
router.get("/filter", driverController.filterDrivers);

// Standard CRUD
router.get("/", driverController.getAllDrivers);
router.get("/:id", driverController.getDriverById);
router.post("/", driverController.createDriver);
router.put("/:id", driverController.updateDriver);
router.delete("/:id", driverController.deleteDriver);

// Status & safety specific updates
router.put("/:id/status", driverController.updateDriverStatus);
router.put("/:id/safety", driverController.updateSafetyStatus);

module.exports = router;
