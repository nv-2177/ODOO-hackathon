const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getTrips, addTrip } = require("../controllers/tripController");

router.get("/", auth, getTrips);
router.post("/", auth, addTrip);

module.exports = router;
