const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");

// Demo settings store (in-memory, resets on restart)
let settings = {
  companyName: "Fleet Management System",
  currency: "INR",
  fuelBudgetThreshold: 50000,
  maintenanceHighThreshold: 20000,
};

router.get("/", auth, (req, res) => res.json(settings));

// Only Admins can modify system settings
router.put("/", auth, allowRoles("Admin"), (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

module.exports = router;
