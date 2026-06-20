const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

global.isMockDb = false;

const connectDB = async () => {
  // If MONGO_URI is a shell command or is missing, use Mock DB mode
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.startsWith("mongosh") || mongoUri.includes("YOUR_")) {
    console.log("⚠️  Invalid or missing MONGO_URI. Fallback to LOCAL MOCK DB mode enabled.");
    global.isMockDb = true;
    initializeMockDb();
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log("⚠️  Falling back to LOCAL MOCK DB mode.");
    global.isMockDb = true;
    initializeMockDb();
  }
};

const initializeMockDb = () => {
  const dbDir = path.join(__dirname, "../data");
  const dbFile = path.join(dbDir, "mockDb.json");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(
      dbFile,
      JSON.stringify({ users: [], trips: [] }, null, 2),
      "utf8"
    );
  }
  console.log(`📁 Local Mock DB initialized at: ${dbFile}`);
};

module.exports = connectDB;