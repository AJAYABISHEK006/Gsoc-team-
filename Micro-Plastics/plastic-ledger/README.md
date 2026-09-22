# Plastic Ledger

**Plastic Ledger** is an end-to-end environmental intelligence and cryptographic audit platform integrating satellite Earth observation, sub-pixel deep learning vision, and physics-informed neural networks (PINNs) to detect, quantify, and trace microplastics and marine debris from microscopic samples to global ocean current drift.

Built on the **MERN Stack** (MongoDB, Express.js, React, Node.js) with an embedded Python AI & Remote Sensing engine.

---

## Core Technical Pillars

### 1. Vision: Sub-Pixel Segmentation (SegFormer & Mask2Former)
* **Model**: SegFormer (MiT transformer encoder + all-MLP decoder) / Mask2Former for Nile Red fluorescence microscopy.
* **Polymer Classes**: `ABS`, `Nylon`, `PE`, `PET`, `PS`, and `PVC`.
* **Caliper Quantification**: Sub-pixel polygon boundaries, Feret maximum/minimum diameter ($\mu m$), surface area ($\mu m^2$), circularity/tortuosity, and seawater Stokes settling velocities.

### 2. Physics-AI: DeepXDE Advection-Diffusion-Settling PINNs
* **Hydrodynamic Formulation**:
  $$\frac{\partial C}{\partial t} + \vec{u} \cdot \nabla C = K_h \nabla^2 C - w_s \frac{\partial C}{\partial z} + S(x, y, t)$$
* **DeepXDE Solver**: Solves forward 48-hour marine plume dispersion and backward-in-time adjoint inverse transport to pinpoint candidate terrestrial river mouths, wastewater sluices, or maritime ports.

### 3. Satellite: Sentinel-2 & Landsat-9 API Ingestion
* **Copernicus Sentinel-2 MSI**: 10m/20m multispectral bands (B02, B03, B04, B08, B11, B12) with Floating Debris Index (FDI) and Kikaki Plastic Index (PI).
* **Landsat-9 OLI-2**: 30m multispectral cross-sensor calibrated surface reflectance.

### 4. Cryptographic Environmental Ledger
* SHA-256 block chain storing verified satellite alerts, SegFormer detection audits, and PINN backward attribution proofs.

---

## Repository Structure

```
plastic-ledger/
├── backend/
│   ├── server.js               # Express.js REST API (MERN Backend)
│   ├── main.py                 # Python companion entrypoint
│   ├── config.js & config.py   # System configuration & calibration
│   ├── database.js             # Mongoose connection with persistent fallback
│   ├── api/
│   │   ├── satellite.js        # Sentinel-2 & Landsat-9 endpoints
│   │   ├── detection.js        # SegFormer sub-pixel vision endpoints
│   │   ├── physics.js          # DeepXDE PINN transport simulation
│   │   ├── sources.js          # Pollution source attribution matrix
│   │   ├── map.js              # Ocean GIS GeoJSON layers & current vectors
│   │   └── ledger.js           # SHA-256 cryptographic audit ledger
│   ├── services/
│   │   ├── copernicus.js       # Sentinel-2 CDSE client & FDI engine
│   │   ├── landsat.js          # Landsat-9 USGS/STAC pipeline
│   │   ├── preprocessing.js    # Tiling & contrast normalization
│   │   ├── detection.js        # SegFormer inference bridge
│   │   └── attribution.js      # DeepXDE hydrodynamic attribution
│   └── models/
│       ├── Detection.js        # Mongoose schema for particles & polygons
│       ├── SatelliteScene.js   # Mongoose schema for satellite passes
│       ├── PINNSimulation.js   # Mongoose schema for PINN runs
│       ├── PollutionSource.js  # Mongoose schema for river & port sources
│       └── LedgerRecord.js     # Cryptographic audit block schema
├── frontend/                   # Modern Vite + React Single Page Application
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx             # Main dashboard assembly
│   │   ├── index.css           # Oceanic dark theme & glassmorphic styling
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── OceanMap.jsx          # Interactive Leaflet GIS ocean map
│   │   │   ├── SegFormerStudio.jsx   # Sub-pixel canvas & Feret caliper
│   │   │   ├── DeepXDESimulator.jsx  # PINN advection-settling solver UI
│   │   │   ├── SatelliteViewer.jsx   # Sentinel-2 & Landsat-9 spectral viewer
│   │   │   ├── SourceAttribution.jsx # Inverse PINN source ranking
│   │   │   └── LedgerAudit.jsx       # SHA-256 cryptographic block explorer
│   │   └── services/api.js     # API client
├── ai/                         # Deep Learning & Physics-AI Subsystem
│   ├── vision/
│   │   ├── segformer_inference.py    # Sub-pixel contour & polygon extraction
│   │   └── mask2former_config.py
│   ├── physics_ai/
│   │   ├── deepxde_advection_pinn.py # DeepXDE PINN transport PDE solver
│   │   └── ocean_currents.py         # CMEMS velocity vector simulation
│   ├── satellite/
│   │   ├── sentinel2_fdi.py          # Sentinel-2 MSI Floating Debris Index
│   │   └── landsat9_pipeline.py      # Landsat-9 OLI-2 spectral pipeline
│   ├── datasets/data_loader.py
│   └── models/metadata.json
├── data/
│   ├── raw/
│   ├── processed/
│   └── results/
├── .env
├── .gitignore
├── requirements.txt
└── README.md
```

---

## Quick Start Guide

### 1. Start the Backend Server (Express MERN)
```bash
cd plastic-ledger/backend
npm install
node server.js
```
The backend will launch at `http://localhost:5000`.

### 2. Start the Frontend Application (Vite + React)
```bash
cd plastic-ledger/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Running AI & PINN Tests Standalone (Python)
```bash
cd plastic-ledger
# Test SegFormer sub-pixel vision
python ai/vision/segformer_inference.py --test

# Test DeepXDE advection PINN
python ai/physics_ai/deepxde_advection_pinn.py --test

# Test Sentinel-2 FDI calculation
python ai/satellite/sentinel2_fdi.py --test
```
