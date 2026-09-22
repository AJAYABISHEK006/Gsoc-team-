require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/plastic-ledger",
  COPERNICUS_CDSE_CLIENT_ID: process.env.COPERNICUS_CDSE_CLIENT_ID || "demo_cdse_key",
  USGS_LANDSAT_API_KEY: process.env.USGS_LANDSAT_API_KEY || "demo_usgs_key",
  PYTHON_PATH: process.env.PYTHON_PATH || "python",
  SCALE_PIXELS_PER_MICRON: parseFloat(process.env.SCALE_PIXELS_PER_MICRON || "0.65"),
  PINN_DIFFUSIVITY: parseFloat(process.env.PINN_DIFFUSIVITY || "12.5"),
  DEFAULT_OCEAN_VELOCITY: {
    u_east: 0.35,
    v_north: -0.15
  }
};
