const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getFuelLogs,
  addFuelLog,
  updateFuelLog,
  deleteFuelLog,
} = require("../controllers/fuelController");

router.get("/", auth, getFuelLogs);
router.post("/", auth, addFuelLog);
router.put("/:id", auth, updateFuelLog);
router.delete("/:id", auth, deleteFuelLog);

module.exports = router;
