const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true,
  },
  activities: [activitySchema],
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priceRange: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
  },
  description: {
    type: String,
  },
});

const packingItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "General",
  },
  packed: {
    type: Boolean,
    default: false,
  },
});

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    budgetType: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    interests: [
      {
        type: String,
      },
    ],
    itinerary: [daySchema],
    budgetBreakdown: {
      flights: Number,
      accommodation: Number,
      food: Number,
      activities: Number,
      total: Number,
    },
    hotels: [hotelSchema],
    packingList: [packingItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
