const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getDrivers, addDriver } = require("../controllers/driverController");

router.get("/", auth, getDrivers);
router.post("/", auth, addDriver);

module.exports = router;
