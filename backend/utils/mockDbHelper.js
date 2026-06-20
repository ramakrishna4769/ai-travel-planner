const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/mockDb.json");

const getDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return { users: [], trips: [] };
    }
    const data = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading mock DB:", error);
    return { users: [], trips: [] };
  }
};

const saveDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing mock DB:", error);
  }
};

module.exports = { getDb, saveDb };
