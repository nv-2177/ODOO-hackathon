const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMaintenance, addMaintenance } = require("../controllers/maintenanceController");

router.get("/", auth, getMaintenance);
router.post("/", auth, addMaintenance);

module.exports = router;
