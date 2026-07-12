const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getVehicles, addVehicle } = require("../controllers/vehicleController");

router.get("/", auth, getVehicles);
router.post("/", auth, addVehicle);

module.exports = router;
