const mongoose = require("mongoose");

const SatelliteSceneSchema = new mongoose.Schema({
  sceneId: { type: String, required: true, index: true },
  satellite: { type: String, enum: ["Sentinel-2B MSI", "Sentinel-2A MSI", "Landsat-9 OLI-2"], required: true },
  tileId: { type: String },
  acquisitionDate: { type: Date, default: Date.now },
  cloudCoverPercent: { type: Number, default: 0 },
  centerCoords: {
    lat: Number,
    lon: Number
  },
  fdiHotspotsCount: { type: Number, default: 0 },
  anomalies: [{
    anomalyId: String,
    lat: Number,
    lon: Number,
    fdi: Number,
    ndvi: Number,
    plasticIndex: Number,
    category: String,
    confidence: Number,
    estimatedAreaM2: Number,
    polymerSignature: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SatelliteScene", SatelliteSceneSchema);
