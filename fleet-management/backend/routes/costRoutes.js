const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getSummary } = require("../controllers/costController");

router.get("/summary", auth, getSummary);

module.exports = router;
