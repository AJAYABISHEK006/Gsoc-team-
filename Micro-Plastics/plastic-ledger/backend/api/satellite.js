const express = require("express");
const router = express.Router();
const copernicusService = require("../services/copernicus");
const landsatService = require("../services/landsat");
const database = require("../database");

/**
 * GET /api/satellite/overview
 * Fetches combined Sentinel-2 and Landsat-9 passes & FDI anomalies
 */
router.get("/overview", async (req, res) => {
  try {
    const s2Pass = await copernicusService.getLatestPass();
    const l9Pass = await landsatService.getLatestPass();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      sentinel2: s2Pass,
      landsat9: l9Pass,
      cross_sensor_matching_count: 3
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/satellite/compute-fdi
 * Computes custom FDI given Red, NIR, SWIR1 values
 */
router.post("/compute-fdi", (req, res) => {
  const { red = 0.025, nir = 0.095, swir1 = 0.035, sensor = "Sentinel-2" } = req.body;
  const l_red = 664.6;
  const l_nir = 832.8;
  const l_swir1 = 1613.7;

  const r_prime = red + (swir1 - red) * ((l_nir - l_red) / (l_swir1 - l_red));
  const fdi = nir - r_prime;
  const ndvi = (nir - red) / Math.max(1e-6, nir + red);
  const pi = nir / Math.max(1e-6, nir + red);

  res.json({
    sensor,
    inputs: { red, nir, swir1 },
    fdi: parseFloat(fdi.toFixed(5)),
    ndvi: parseFloat(ndvi.toFixed(4)),
    plastic_index: parseFloat(pi.toFixed(4)),
    classification: fdi > 0.02 && ndvi < 0.15 ? "Floating Micro/Macro Plastic" : (fdi > 0.02 ? "Algal Bloom / Sargassum" : "Clear Water")
  });
});

module.exports = router;
