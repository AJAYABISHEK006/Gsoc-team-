const mongoose = require("mongoose");

const DetectionSchema = new mongoose.Schema({
  sampleId: { type: String, required: true, index: true },
  imageSource: { type: String, default: "nile_red_microscopy" },
  totalParticles: { type: Number, default: 0 },
  totalAreaUm2: { type: Number, default: 0 },
  meanFeretDiameterUm: { type: Number, default: 0 },
  polymerDistribution: { type: Map, of: Number },
  particles: [{
    particleId: String,
    classId: Number,
    polymer: String,
    confidence: Number,
    feretMaxUm: Number,
    feretMinUm: Number,
    areaUm2: Number,
    perimeterUm: Number,
    aspectRatio: Number,
    circularity: Number,
    sizeCategory: String,
    stokesVelocityMS: Number,
    buoyancyBehavior: String,
    polygonSubpixel: [[Number]]
  }],
  coordinates: {
    lat: { type: Number, default: 13.0827 },
    lon: { type: Number, default: 80.2707 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Detection", DetectionSchema);
