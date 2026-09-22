const express = require("express");
const router = express.Router();
const attributionService = require("../services/attribution");

/**
 * POST /api/physics/simulate-pinn
 * Forward advection-diffusion-settling PINN trajectory
 */
router.post("/simulate-pinn", async (req, res) => {
  try {
    const { polymer = "PE", lat = 12.92, lon = 80.25 } = req.body;
    const sim = await attributionService.runForwardSimulation(polymer, lat, lon);
    res.json(sim);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/physics/reverse-attribution
 * Backward-in-time PINN adjoint transport to rank likely pollution emitters
 */
router.post("/reverse-attribution", async (req, res) => {
  try {
    const { detectedCoords = [13.08, 80.32], polymer = "PE" } = req.body;
    const attribution = await attributionService.runInverseAttribution(detectedCoords, polymer);
    res.json(attribution);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/physics/backtrack
 * Full backward drift path (waypoints array) + ranked origin sources
 * Default: 720 hours = 30 days backward (realistic surface plastic transport)
 * Used by OceanMap to animate the backtrack trail on the Leaflet map
 */
router.post("/backtrack", async (req, res) => {
  try {
    const { lat, lon, polymer = "PE", hours = 720 } = req.body;
    if (lat === undefined || lon === undefined) {
      return res.status(400).json({ success: false, error: "lat and lon are required" });
    }
    const result = await attributionService.computeBacktrackPath(
      parseFloat(lat), parseFloat(lon), polymer, parseInt(hours, 10)
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
