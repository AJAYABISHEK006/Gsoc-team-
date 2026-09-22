const express = require("express");
const router = express.Router();
const detectionService = require("../services/detection");
const database = require("../database");

/**
 * POST /api/detection/segment
 * Runs SegFormer sub-pixel segmentation on a microscopic frame
 */
router.post("/segment", async (req, res) => {
  try {
    const { frameId = "nile_red_sample_01", scale = 0.65, polymerFilter } = req.body;
    const result = await detectionService.runSegFormerInference(frameId, scale);

    if (result.success) {
      // Store in DB or in-memory store
      const store = database.getStore();
      store.detections.push(result.data);

      // Optionally filter detections
      let detections = result.data.detections;
      if (polymerFilter && polymerFilter !== "ALL") {
        detections = detections.filter(d => d.polymer.toUpperCase() === polymerFilter.toUpperCase());
      }

      res.json({
        success: true,
        summary: {
          model: result.data.model,
          frameId: result.data.frame_id,
          totalParticles: result.data.total_particles,
          totalAreaUm2: result.data.total_area_um2,
          meanFeretDiameterUm: result.data.mean_feret_diameter_um,
          polymerDistribution: result.data.polymer_distribution
        },
        detections
      });
    } else {
      res.status(500).json({ success: false, error: "SegFormer inference failed" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/detection/polymers
 * Returns the 6 reference polymers and physical attributes
 */
router.get("/polymers", (req, res) => {
  res.json({
    polymers: [
      { id: 0, code: "ABS", name: "Acrylonitrile Butadiene Styrene", density: 1.05, behavior: "Slow sink / neutral", color: "#f72585" },
      { id: 1, code: "Nylon", name: "Polyamide", density: 1.14, behavior: "Sinks (Fiber)", color: "#7209b7" },
      { id: 2, code: "PE", name: "Polyethylene", density: 0.92, behavior: "Floats (Surface)", color: "#4cc9f0" },
      { id: 3, code: "PET", name: "Polyethylene Terephthalate", density: 1.38, behavior: "Sinks (Benthic)", color: "#4361ee" },
      { id: 4, code: "PS", name: "Polystyrene", density: 1.04, behavior: "Suspended / Foam", color: "#06d6a0" },
      { id: 5, code: "PVC", name: "Polyvinyl Chloride", density: 1.40, behavior: "Sinks rapidly", color: "#ffd166" }
    ]
  });
});

module.exports = router;
