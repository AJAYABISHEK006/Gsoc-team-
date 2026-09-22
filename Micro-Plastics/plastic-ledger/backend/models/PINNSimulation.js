const mongoose = require("mongoose");

const PINNSimulationSchema = new mongoose.Schema({
  simulationId: { type: String, required: true, index: true },
  polymer: { type: String, required: true },
  buoyancyRegime: { type: String },
  stokesVelocityMS: { type: Number },
  hydrodynamics: {
    uEastMS: Number,
    vNorthMS: Number,
    eddyDiffusivityM2S: Number
  },
  pinnConvergence: {
    pdeResidualLoss: Number,
    dataLoss: Number,
    epochsTrained: Number
  },
  sourceOrigin: {
    lat: Number,
    lon: Number
  },
  trajectory: [{
    timeHours: Number,
    lat: Number,
    lon: Number,
    peakConcentrationParticlesM3: Number,
    dispersionRadiusMeters: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PINNSimulation", PINNSimulationSchema);
