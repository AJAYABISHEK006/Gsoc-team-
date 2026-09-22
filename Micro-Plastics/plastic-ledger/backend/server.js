const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const { connectDB, getStatus } = require("./database");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect Database
connectDB();

// API Routes
app.use("/api/satellite", require("./api/satellite"));
app.use("/api/detection", require("./api/detection"));
app.use("/api/physics", require("./api/physics"));
app.use("/api/sources", require("./api/sources"));
app.use("/api/map", require("./api/map"));
app.use("/api/ledger", require("./api/ledger"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Plastic Ledger MERN Backend",
    version: "2.4.0",
    timestamp: new Date().toISOString(),
    database: getStatus(),
    modules: {
      vision: "SegFormer Sub-Pixel Segmentation Active",
      physics_ai: "DeepXDE PINN Transport Solver Active",
      satellite: "Sentinel-2 & Landsat-9 MSI/OLI-2 Pipelines Active",
      ledger: "SHA-256 Verifiable Audit Trail Active"
    }
  });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌊 Plastic Ledger Backend running on http://localhost:${PORT}`);
  console.log(`📡 SegFormer Vision | DeepXDE PINN | Sentinel & Landsat APIs`);
  console.log(`====================================================`);
});

module.exports = app;
