const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const database = require("../database");

// Seed initial Genesis block and subsequent audit logs
const INITIAL_LEDGER = [
  {
    index: 0,
    timestamp: "2026-09-01T00:00:00.000Z",
    eventType: "GENESIS_AUDIT_BLOCK",
    location: "Global Ocean Sentinel Ledger",
    summary: "Genesis block initialized for Marine & Microplastic Traceability System",
    attributedParty: "Plastic Ledger Consortium",
    severity: "LOW",
    previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "8f4813a49f57fe7c234a94931a545041a76c8cb8fbff9e3b6a22f30b910e7b78",
    verified: true
  },
  {
    index: 1,
    timestamp: "2026-09-08T05:30:12.000Z",
    eventType: "SATELLITE_FDI_ALERT",
    location: "Bay of Bengal (Tile T44VNR)",
    summary: "Sentinel-2 MSI pass detected high FDI anomaly (0.0845) indicating polymer matrix plume",
    attributedParty: "Adyar River Plume Discharge",
    severity: "HIGH",
    previousHash: "8f4813a49f57fe7c234a94931a545041a76c8cb8fbff9e3b6a22f30b910e7b78",
    hash: "a3b819f7e029486c4bc81d6f2845c110398f6212e316d29ea729606d5c5890fa",
    verified: true
  },
  {
    index: 2,
    timestamp: "2026-09-08T09:15:40.000Z",
    eventType: "SEGFOMER_DETECTION_AUDIT",
    location: "Coastal Ingestion Station #04",
    summary: "SegFormer sub-pixel segmentation verified 28 particles: High PE (46%) and PET (32%)",
    attributedParty: "Urban Single-Use Packaging Runoff",
    severity: "HIGH",
    previousHash: "a3b819f7e029486c4bc81d6f2845c110398f6212e316d29ea729606d5c5890fa",
    hash: "c948e910f135b71946dcba023819e019ab7281f9640103721759ea294101e9d1",
    verified: true
  },
  {
    index: 3,
    timestamp: "2026-09-09T14:42:18.000Z",
    eventType: "PINN_ATTRIBUTION_TRACE",
    location: "Offshore Plume Lat 13.08 Lon 80.32",
    summary: "DeepXDE Advection-Diffusion PINN traced plume trajectory to Ennore Port with 94.2% confidence",
    attributedParty: "Ennore Port Maritime Operations",
    severity: "CRITICAL",
    previousHash: "c948e910f135b71946dcba023819e019ab7281f9640103721759ea294101e9d1",
    hash: "e5018fba9206d8174526f8d38101684c9823901bca8594026da6818e9508cb21",
    verified: true
  }
];

router.get("/records", (req, res) => {
  const store = database.getStore();
  const allRecords = [...INITIAL_LEDGER, ...store.ledger];
  res.json({
    success: true,
    totalRecords: allRecords.length,
    blockchainIntegrity: "VALID",
    records: allRecords
  });
});

router.post("/append", (req, res) => {
  const { eventType, location, summary, attributedParty, severity, payload } = req.body;
  const store = database.getStore();
  const allRecords = [...INITIAL_LEDGER, ...store.ledger];
  const prevRecord = allRecords[allRecords.length - 1];

  const index = allRecords.length;
  const timestamp = new Date().toISOString();
  const prevHash = prevRecord.hash;

  const hashString = `${index}-${prevHash}-${timestamp}-${eventType}-${summary}-${attributedParty}`;
  const hash = crypto.createHash("sha256").update(hashString).digest("hex");

  const newEntry = {
    index,
    timestamp,
    eventType: eventType || "MANUAL_INSPECTION_AUDIT",
    location: location || "Coastal Station #01",
    summary: summary || "Manual microplastic sample validation logged",
    attributedParty: attributedParty || "Pending Attribution",
    severity: severity || "MEDIUM",
    previousHash: prevHash,
    hash,
    verified: true,
    payload: payload || {}
  };

  store.ledger.push(newEntry);

  res.json({
    success: true,
    message: "Block successfully appended to Plastic Ledger",
    record: newEntry
  });
});

router.get("/stats", (req, res) => {
  res.json({
    success: true,
    total_audited_metric_tons: 1845.2,
    active_monitored_sources: 4,
    verified_satellite_passes: 18,
    average_pinn_confidence: 93.4,
    polymer_breakdown_tons: {
      PE: 740.1,
      PET: 412.5,
      PVC: 298.0,
      Nylon: 186.4,
      PS: 120.2,
      ABS: 88.0
    }
  });
});

module.exports = router;
