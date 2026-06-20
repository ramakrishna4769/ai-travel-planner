const express = require("express");
const {
  generateTrip,
  getTrips,
  getTripById,
  updateTrip,
  regenerateDay,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, generateTrip)
  .get(protect, getTrips);

router.route("/:id")
  .get(protect, getTripById)
  .put(protect, updateTrip);

router.post("/:id/regenerate-day", protect, regenerateDay);

module.exports = router;
