const Trip = require("../models/Trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getDb, saveDb } = require("../utils/mockDbHelper");

// Helper for Mock Itinerary Generation
const generateMockItinerary = (destination, days, budgetType, interests) => {
  const interestStr = interests.length > 0 ? interests.join(" & ") : "general sightseeing";
  const itinerary = [];
  
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      dayNumber: i,
      activities: [
        {
          time: "Morning",
          title: `Explore Main Landmarks in ${destination}`,
          description: `Kickstart your day exploring the heart of the city. Make sure to experience the local architecture and vibe catering to your interest in ${interestStr}.`,
        },
        {
          time: "Afternoon",
          title: `Local Food Tour & Shopping`,
          description: `Grab a traditional lunch at a highly-rated eatery. Walk around the shopping districts and grab some local souvenirs.`,
        },
        {
          time: "Evening",
          title: `Relaxing Evening & Scenic Dinner`,
          description: `Wind down after a busy day. Enjoy a beautiful sunset view followed by dinner featuring local delicacies.`,
        },
      ],
    });
  }

  const budgetBase = budgetType === "Low" ? 1 : budgetType === "High" ? 3 : 2;
  const budgetBreakdown = {
    flights: 250 * budgetBase,
    accommodation: 80 * days * budgetBase,
    food: 30 * days * budgetBase,
    activities: 20 * days * budgetBase,
  };
  budgetBreakdown.total =
    budgetBreakdown.flights +
    budgetBreakdown.accommodation +
    budgetBreakdown.food +
    budgetBreakdown.activities;

  const hotels = [
    {
      name: `${destination} Luxury Palace`,
      priceRange: "Luxury",
      rating: "4.9/5",
      description: "A premium 5-star experience with outstanding service, spa facilities, and central location.",
    },
    {
      name: `${destination} View Hotel`,
      priceRange: "Mid Range",
      rating: "4.5/5",
      description: "Comfortable and modern hotel offering scenic views, free breakfast, and friendly staff.",
    },
    {
      name: `${destination} Budget Inn`,
      priceRange: "Budget Friendly",
      rating: "4.2/5",
      description: "Clean, cozy, and affordable accommodation. Highly rated by solo travelers and backpackers.",
    },
  ];

  const packingList = [
    { item: "Passport & Travel Documents", category: "Documents" },
    { item: "Universal Adapter & Chargers", category: "Electronics" },
    { item: "Comfortable Walking Shoes", category: "Clothing" },
    { item: "Personal Toiletries & Sunscreen", category: "Toiletries" },
    { item: "First Aid Kit & Personal Meds", category: "Miscellaneous" },
  ];

  if (interests.includes("Adventure")) {
    packingList.push({ item: "Hiking/Athletic Clothes", category: "Clothing" });
    packingList.push({ item: "Reusable Water Bottle", category: "Miscellaneous" });
  }
  if (interests.includes("Food")) {
    packingList.push({ item: "Hand Sanitizer & Wet Wipes", category: "Toiletries" });
  }
  if (interests.includes("Shopping")) {
    packingList.push({ item: "Foldable Shopping Bag", category: "Miscellaneous" });
  }

  return { itinerary, budgetBreakdown, hotels, packingList };
};

// @desc    Generate a new trip itinerary
// @route   POST /api/trips
// @access  Private
exports.generateTrip = async (req, res) => {
  try {
    const { destination, days, budgetType, interests } = req.body;
    const userId = req.user._id;

    if (!destination || !days || !budgetType) {
      return res.status(400).json({ message: "Please provide destination, days, and budgetType" });
    }

    let tripData;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log("ℹ️ No GEMINI_API_KEY provided. Using high-quality mock generator...");
      tripData = generateMockItinerary(destination, Number(days), budgetType, interests || []);
    } else {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-1.5-flash as the standard, robust model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are an expert travel planner AI agent. Generate a detailed travel itinerary, estimated budget breakdown, recommended hotels, and a custom packing list based on these details:
          Destination: ${destination}
          Number of Days: ${days}
          Budget Type: ${budgetType} (adjust accommodation, activities, and food costs accordingly)
          Interests: ${(interests || []).join(", ")}

          You MUST return a JSON object with the exact structure:
          {
            "itinerary": [
              {
                "dayNumber": 1,
                "activities": [
                  {
                    "time": "Morning | Afternoon | Evening",
                    "title": "Activity Title",
                    "description": "Short description of what to do"
                  }
                ]
              }
            ],
            "budgetBreakdown": {
              "flights": 400,
              "accommodation": 300,
              "food": 150,
              "activities": 100,
              "total": 950
            },
            "hotels": [
              {
                "name": "Hotel Name",
                "priceRange": "Budget Friendly | Mid Range | Luxury",
                "rating": "4.5/5",
                "description": "Short description of the hotel and amenities"
              }
            ],
            "packingList": [
              {
                "item": "Item Name",
                "category": "Clothing | Electronics | Toiletries | Documents | Miscellaneous"
              }
            ]
          }

          Rule 1: Return ONLY the JSON object. Do not wrap in markdown \`\`\`json blocks.
          Rule 2: The budget numbers must be simple integers in USD.
          Rule 3: Ensure the packing items are customized specifically to the destination (e.g. insect repellent for tropical zones, rain gear for London, warm clothing for Iceland) and the selected interests.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Remove code block wrappers if model ignores instructions
        let cleanJsonText = responseText;
        if (cleanJsonText.startsWith("```")) {
          cleanJsonText = cleanJsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        }

        tripData = JSON.parse(cleanJsonText);
      } catch (geminiError) {
        console.error("Gemini API Error, falling back to mock generator:", geminiError);
        tripData = generateMockItinerary(destination, Number(days), budgetType, interests || []);
      }
    }

    // Save Trip
    if (global.isMockDb) {
      const db = getDb();
      const newTrip = {
        _id: Math.random().toString(36).substring(2, 11),
        user: userId,
        destination,
        days: Number(days),
        budgetType,
        interests: interests || [],
        itinerary: tripData.itinerary,
        budgetBreakdown: tripData.budgetBreakdown,
        hotels: tripData.hotels,
        packingList: (tripData.packingList || []).map((item, idx) => ({
          _id: Math.random().toString(36).substring(2, 11),
          item: item.item,
          category: item.category || "General",
          packed: false,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      db.trips.push(newTrip);
      saveDb(db);

      return res.status(201).json(newTrip);
    }

    const newTrip = await Trip.create({
      user: userId,
      destination,
      days: Number(days),
      budgetType,
      interests: interests || [],
      itinerary: tripData.itinerary,
      budgetBreakdown: tripData.budgetBreakdown,
      hotels: tripData.hotels,
      packingList: (tripData.packingList || []).map(item => ({
        item: item.item,
        category: item.category || "General",
        packed: false
      })),
    });

    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Generate Trip Error:", error);
    res.status(500).json({ message: "Failed to generate trip", error: error.message });
  }
};

// @desc    Get all trips for authenticated user
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res) => {
  try {
    const userId = req.user._id;

    if (global.isMockDb) {
      const db = getDb();
      const userTrips = db.trips.filter((t) => t.user.toString() === userId.toString());
      return res.json(userTrips);
    }

    const trips = await Trip.find({ user: userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};

// @desc    Get trip details by ID
// @route   GET /api/trips/:id
// @access  Private
exports.getTripById = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id;

    if (global.isMockDb) {
      const db = getDb();
      const trip = db.trips.find((t) => t._id.toString() === tripId.toString());

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Check authorization (strict data isolation)
      if (trip.user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Access denied. You do not own this trip." });
      }

      return res.json(trip);
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied. You do not own this trip." });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trip", error: error.message });
  }
};

// @desc    Update trip details (manual modifications like pack checkbox, delete activity)
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id;

    if (global.isMockDb) {
      const db = getDb();
      const tripIndex = db.trips.findIndex((t) => t._id.toString() === tripId.toString());

      if (tripIndex === -1) {
        return res.status(404).json({ message: "Trip not found" });
      }

      if (db.trips[tripIndex].user.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update allowed fields
      const updatedFields = req.body;
      db.trips[tripIndex] = {
        ...db.trips[tripIndex],
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      };
      
      saveDb(db);
      return res.json(db.trips[tripIndex]);
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Direct assignment updates
    Object.assign(trip, req.body);
    await trip.save();

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Failed to update trip", error: error.message });
  }
};

// @desc    Regenerate a specific day's activities
// @route   POST /api/trips/:id/regenerate-day
// @access  Private
exports.regenerateDay = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id;
    const { dayNumber, instruction } = req.body;

    if (!dayNumber || !instruction) {
      return res.status(400).json({ message: "Please provide dayNumber and instruction" });
    }

    let trip;
    if (global.isMockDb) {
      const db = getDb();
      trip = db.trips.find((t) => t._id.toString() === tripId.toString());
    } else {
      trip = await Trip.findById(tripId);
    }

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let updatedActivities = [];

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.log("ℹ️ No GEMINI_API_KEY. Simulating regeneration of day...");
      // Simulate regeneration
      updatedActivities = [
        {
          time: "Morning",
          title: `Modified Morning Activity: Outdoor Exploring`,
          description: `Regenerated activities following instruction: "${instruction}". Get outside and enjoy the beautiful sites!`,
        },
        {
          time: "Afternoon",
          title: `Modified Afternoon Activity: Fun Adventures`,
          description: `A new customized activity satisfying your request: "${instruction}".`,
        },
        {
          time: "Evening",
          title: `Modified Evening Activity: Cozy Dinner`,
          description: `Dine at a peaceful restaurant matching the regenerated mood: "${instruction}".`,
        },
      ];
    } else {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are an expert travel planner AI agent.
          The user is planning a trip to ${trip.destination} for ${trip.days} days with interests in ${trip.interests.join(", ")}.
          Currently, the activities scheduled for Day ${dayNumber} are:
          ${JSON.stringify(trip.itinerary.find(d => Number(d.dayNumber) === Number(dayNumber))?.activities || [], null, 2)}

          The user wants to REGENERATE ONLY Day ${dayNumber} with this instruction: "${instruction}".
          You MUST output a JSON array of activities for Day ${dayNumber} following this instruction.
          The response should match the exact JSON array schema:
          [
            {
              "time": "Morning | Afternoon | Evening",
              "title": "Activity Title",
              "description": "Activity Description"
            }
          ]

          Return ONLY the JSON array. Do not wrap in markdown \`\`\`json blocks.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        let cleanJsonText = responseText;
        if (cleanJsonText.startsWith("```")) {
          cleanJsonText = cleanJsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        }

        updatedActivities = JSON.parse(cleanJsonText);
      } catch (geminiError) {
        console.error("Gemini regeneration failed, using mock regeneration:", geminiError);
        updatedActivities = [
          {
            time: "Morning",
            title: `Modified Morning Activity: Outdoor Exploring`,
            description: `Regenerated activities following instruction: "${instruction}". Get outside and enjoy the beautiful sites!`,
          },
          {
            time: "Afternoon",
            title: `Modified Afternoon Activity: Fun Adventures`,
            description: `A new customized activity satisfying your request: "${instruction}".`,
          },
          {
            time: "Evening",
            title: `Modified Evening Activity: Cozy Dinner`,
            description: `Dine at a peaceful restaurant matching the regenerated mood: "${instruction}".`,
          },
        ];
      }
    }

    // Apply updates
    const dayIndex = trip.itinerary.findIndex(d => Number(d.dayNumber) === Number(dayNumber));
    if (dayIndex !== -1) {
      if (global.isMockDb) {
        const db = getDb();
        const tripIndex = db.trips.findIndex((t) => t._id.toString() === tripId.toString());
        db.trips[tripIndex].itinerary[dayIndex].activities = updatedActivities.map(act => ({
          ...act,
          _id: Math.random().toString(36).substring(2, 11)
        }));
        db.trips[tripIndex].updatedAt = new Date().toISOString();
        saveDb(db);
        return res.json(db.trips[tripIndex]);
      } else {
        trip.itinerary[dayIndex].activities = updatedActivities;
        await trip.save();
      }
    } else {
      return res.status(400).json({ message: `Day ${dayNumber} not found in this itinerary` });
    }

    res.json(trip);
  } catch (error) {
    console.error("Regenerate Day Error:", error);
    res.status(500).json({ message: "Failed to regenerate day", error: error.message });
  }
};
