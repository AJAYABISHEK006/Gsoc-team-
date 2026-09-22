const mongoose = require("mongoose");
const config = require("./config");

let isConnected = false;
const inMemoryStore = {
  detections: [],
  satelliteScenes: [],
  pinnSimulations: [],
  sources: [],
  ledger: []
};

async function connectDB() {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(" Connected to MongoDB:", config.MONGODB_URI);
  } catch (err) {
    console.warn("⚠️ MongoDB connection unavailable. Operating in persistent In-Memory / Development mode.");
    isConnected = false;
  }
}

function getStore() {
  return inMemoryStore;
}

function getStatus() {
  return {
    database: isConnected ? "MongoDB" : "In-Memory Fallback Engine",
    connected: isConnected,
    totalRecords: {
      detections: inMemoryStore.detections.length,
      satelliteScenes: inMemoryStore.satelliteScenes.length,
      pinnSimulations: inMemoryStore.pinnSimulations.length,
      sources: inMemoryStore.sources.length,
      ledger: inMemoryStore.ledger.length
    }
  };
}

module.exports = {
  connectDB,
  getStore,
  getStatus,
  mongoose
};
