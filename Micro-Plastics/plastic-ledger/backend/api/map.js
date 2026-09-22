const express = require("express");
const router = express.Router();

// ============================================================
// Deterministic seeded RNG — same data on every request
// ============================================================
function makeRNG(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

const POLYMERS   = ["PE", "PET", "PS", "Nylon", "ABS", "PVC"];
const SEVERITIES = ["CRITICAL", "HIGH", "HIGH", "MEDIUM", "MEDIUM", "LOW"];
const SENSORS    = [
  "Sentinel-2 MSI", "Landsat-9 OLI-2", "MODIS Terra",
  "Copernicus Marine", "Argo Float Network", "VIIRS/NPP", "Field Survey"
];

// ============================================================
// Generate deterministic hotspot scatter around a gyre centre
// ============================================================
function generateGyreHotspots(prefix, gyreName, ocean, centerLat, centerLon, latSpread, lonSpread, count, seedOffset) {
  const rng = makeRNG(seedOffset);
  const hotspots = [];
  for (let i = 0; i < count; i++) {
    const dlat = ((rng() + rng()) - 1.0) * latSpread;
    const dlon = ((rng() + rng()) - 1.0) * lonSpread;
    const lat  = parseFloat((centerLat + dlat).toFixed(4));
    const lon  = parseFloat((centerLon + dlon).toFixed(4));
    hotspots.push({
      id:           `${prefix}-${String(i + 1).padStart(3, "0")}`,
      lat,
      lon,
      severity:     SEVERITIES[Math.floor(rng() * SEVERITIES.length)],
      polymer:      POLYMERS[Math.floor(rng() * POLYMERS.length)],
      particles_m3: parseFloat((rng() * 48 + 2).toFixed(1)),
      fdi:          parseFloat((rng() * 0.19 + 0.015).toFixed(3)),
      mass_tons:    parseFloat((rng() * 90 + 5).toFixed(1)),
      source:       SENSORS[Math.floor(rng() * SENSORS.length)],
      gyre:         gyreName,
      ocean,
    });
  }
  return hotspots;
}

// ============================================================
// River discharge plumes — fixed positions at major estuaries
// ============================================================
const RIVER_HOTSPOTS = [
  // East Asia
  { id:"RIV-001", lat:30.95,  lon:122.15,  severity:"CRITICAL", polymer:"PE",    particles_m3:52.4, fdi:0.198, mass_tons:340.2, source:"Sentinel-2 MSI",    gyre:"Yangtze Estuary Plume",           ocean:"Pacific"      },
  { id:"RIV-002", lat:22.35,  lon:114.15,  severity:"CRITICAL", polymer:"PET",   particles_m3:44.1, fdi:0.175, mass_tons:280.5, source:"Landsat-9 OLI-2",  gyre:"Pearl River Delta Plume",         ocean:"Pacific"      },
  { id:"RIV-003", lat:10.55,  lon:107.35,  severity:"HIGH",     polymer:"PE",    particles_m3:38.2, fdi:0.152, mass_tons:220.8, source:"MODIS Terra",       gyre:"Mekong Delta Plume",              ocean:"Pacific"      },
  { id:"RIV-004", lat:16.85,  lon:96.25,   severity:"HIGH",     polymer:"PVC",   particles_m3:35.9, fdi:0.148, mass_tons:178.4, source:"VIIRS/NPP",         gyre:"Irrawaddy Plume",                 ocean:"Indian"       },
  // South Asia
  { id:"RIV-005", lat:21.25,  lon:89.05,   severity:"CRITICAL", polymer:"PE",    particles_m3:47.8, fdi:0.188, mass_tons:295.1, source:"Landsat-9 OLI-2",  gyre:"Ganges-Brahmaputra Delta Plume",  ocean:"Indian"       },
  { id:"RIV-006", lat:16.20,  lon:82.08,   severity:"HIGH",     polymer:"Nylon", particles_m3:28.5, fdi:0.114, mass_tons:185.3, source:"Sentinel-2 MSI",   gyre:"Godavari Delta Plume",            ocean:"Indian"       },
  { id:"RIV-007", lat:24.05,  lon:67.25,   severity:"HIGH",     polymer:"PS",    particles_m3:31.2, fdi:0.131, mass_tons:142.8, source:"Copernicus Marine", gyre:"Indus Delta Plume",               ocean:"Indian"       },
  { id:"RIV-008", lat:13.01,  lon:80.28,   severity:"HIGH",     polymer:"PE",    particles_m3:26.4, fdi:0.108, mass_tons:112.6, source:"Sentinel-2 MSI",   gyre:"Adyar-Cooum Plume (Chennai)",     ocean:"Indian"       },
  // Africa
  { id:"RIV-009", lat:4.25,   lon:6.55,    severity:"HIGH",     polymer:"PE",    particles_m3:29.8, fdi:0.122, mass_tons:198.3, source:"Sentinel-2 MSI",   gyre:"Niger Delta Plume",               ocean:"Atlantic"     },
  { id:"RIV-010", lat:31.45,  lon:31.85,   severity:"HIGH",     polymer:"PET",   particles_m3:25.4, fdi:0.104, mass_tons:152.7, source:"Landsat-9 OLI-2",  gyre:"Nile Delta Plume",                ocean:"Mediterranean"},
  { id:"RIV-011", lat:-4.05,  lon:11.55,   severity:"MEDIUM",   polymer:"PE",    particles_m3:18.7, fdi:0.078, mass_tons:98.2,  source:"MODIS Terra",       gyre:"Congo River Mouth",               ocean:"Atlantic"     },
  { id:"RIV-012", lat:5.75,   lon:0.05,    severity:"MEDIUM",   polymer:"Nylon", particles_m3:14.8, fdi:0.062, mass_tons:85.4,  source:"VIIRS/NPP",         gyre:"Volta River Plume",               ocean:"Atlantic"     },
  // Americas
  { id:"RIV-013", lat:0.35,   lon:-50.25,  severity:"MEDIUM",   polymer:"PS",    particles_m3:14.2, fdi:0.058, mass_tons:82.5,  source:"Copernicus Marine", gyre:"Amazon Plume",                    ocean:"Atlantic"     },
  { id:"RIV-014", lat:29.05,  lon:-89.45,  severity:"HIGH",     polymer:"PET",   particles_m3:26.1, fdi:0.109, mass_tons:168.4, source:"Sentinel-2 MSI",   gyre:"Mississippi Delta Plume",         ocean:"Atlantic"     },
  { id:"RIV-015", lat:-22.85, lon:-43.25,  severity:"HIGH",     polymer:"PVC",   particles_m3:24.5, fdi:0.098, mass_tons:118.2, source:"Landsat-9 OLI-2",  gyre:"Rio de Janeiro Coastal Zone",     ocean:"Atlantic"     },
  // Europe
  { id:"RIV-016", lat:45.35,  lon:29.75,   severity:"HIGH",     polymer:"PVC",   particles_m3:22.5, fdi:0.092, mass_tons:121.3, source:"Copernicus Marine", gyre:"Danube Delta Plume",              ocean:"Black Sea"    },
  { id:"RIV-017", lat:51.95,  lon:4.25,    severity:"MEDIUM",   polymer:"PS",    particles_m3:12.8, fdi:0.052, mass_tons:76.4,  source:"Sentinel-2 MSI",   gyre:"Rhine Estuary Plume",             ocean:"North Sea"    },
];

// ============================================================
// Major shipping-lane debris zones
// ============================================================
const SHIPPING_HOTSPOTS = [
  { id:"SHIP-001", lat:1.25,   lon:104.15,  severity:"HIGH",   polymer:"Nylon", particles_m3:34.5, fdi:0.138, mass_tons:245.8, source:"AIS+MODIS",        gyre:"Strait of Malacca Corridor", ocean:"Indian"   },
  { id:"SHIP-002", lat:12.75,  lon:44.35,   severity:"HIGH",   polymer:"PE",    particles_m3:28.9, fdi:0.118, mass_tons:198.2, source:"Sentinel-2 MSI",   gyre:"Gulf of Aden Corridor",      ocean:"Indian"   },
  { id:"SHIP-003", lat:30.85,  lon:32.55,   severity:"MEDIUM", polymer:"PET",   particles_m3:18.4, fdi:0.075, mass_tons:112.3, source:"Landsat-9 OLI-2",  gyre:"Suez Canal Zone",            ocean:"Red Sea"  },
  { id:"SHIP-004", lat:51.35,  lon:3.15,    severity:"MEDIUM", polymer:"ABS",   particles_m3:16.2, fdi:0.065, mass_tons:98.7,  source:"Copernicus Marine", gyre:"English Channel Corridor",   ocean:"Atlantic" },
  { id:"SHIP-005", lat:9.15,   lon:-79.85,  severity:"HIGH",   polymer:"Nylon", particles_m3:31.5, fdi:0.128, mass_tons:214.6, source:"VIIRS/NPP",         gyre:"Panama Canal Zone",          ocean:"Pacific"  },
  { id:"SHIP-006", lat:36.35,  lon:14.55,   severity:"MEDIUM", polymer:"ABS",   particles_m3:13.8, fdi:0.056, mass_tons:88.4,  source:"Sentinel-2 MSI",   gyre:"Central Mediterranean Lane", ocean:"Mediterranean" },
];

// ============================================================
// 5 Ocean Gyre accumulation polygons
// ============================================================
const GYRE_POLYGONS = [
  {
    id: "north-pacific-gyre",
    name: "Great Pacific Garbage Patch",
    ocean: "North Pacific",
    mass_estimate_tons: 79000,
    area_km2: 1600000,
    color: "#f72585",
    polygon: [[45,-135],[45,-162],[25,-162],[25,-135],[45,-135]]
  },
  {
    id: "south-pacific-gyre",
    name: "South Pacific Subtropical Gyre",
    ocean: "South Pacific",
    mass_estimate_tons: 37000,
    area_km2: 1100000,
    color: "#ffb703",
    polygon: [[-20,-90],[-20,-130],[-46,-130],[-46,-90],[-20,-90]]
  },
  {
    id: "north-atlantic-gyre",
    name: "North Atlantic Garbage Patch",
    ocean: "North Atlantic",
    mass_estimate_tons: 56000,
    area_km2: 700000,
    color: "#7209b7",
    polygon: [[42,-30],[42,-55],[22,-55],[22,-30],[42,-30]]
  },
  {
    id: "south-atlantic-gyre",
    name: "South Atlantic Subtropical Gyre",
    ocean: "South Atlantic",
    mass_estimate_tons: 21000,
    area_km2: 550000,
    color: "#4cc9f0",
    polygon: [[-20,0],[-20,-30],[-42,-30],[-42,0],[-20,0]]
  },
  {
    id: "indian-ocean-gyre",
    name: "Indian Ocean Subtropical Gyre",
    ocean: "Indian Ocean",
    mass_estimate_tons: 31000,
    area_km2: 900000,
    color: "#06d6a0",
    polygon: [[-18,55],[-18,100],[-38,100],[-38,55],[-18,55]]
  },
];

// ============================================================
// Simplified global ocean current grid (CMEMS-informed)
// ============================================================
function buildCurrentGrid() {
  const currents = [];
  for (let lat = -55; lat <= 60; lat += 12) {
    for (let lon = -175; lon <= 180; lon += 18) {
      const u = parseFloat((Math.sin(lat * Math.PI / 28) * 0.38).toFixed(3));
      const v = parseFloat((Math.cos(lon * Math.PI / 55) * 0.18).toFixed(3));
      const dir = Math.round(((Math.atan2(v, u) * 180 / Math.PI) + 360) % 360);
      currents.push({ lat, lon, u_east: u, v_north: v, speed_knots: parseFloat((Math.sqrt(u*u + v*v) * 1.9).toFixed(2)), direction: dir });
    }
  }
  return currents;
}

const CURRENT_GRID = buildCurrentGrid();

// ============================================================
// Route: GET /api/map/layers
// ============================================================
router.get("/layers", (req, res) => {
  // Generate all gyre hotspots (deterministic)
  const npg = generateGyreHotspots("NPG", "Great Pacific Garbage Patch (North Pacific Gyre)", "Pacific",  35.0, -148.0, 8, 15, 50, 1000);
  const spg = generateGyreHotspots("SPG", "South Pacific Subtropical Gyre",                  "Pacific", -35.0, -103.0, 7, 14, 30, 2000);
  const nag = generateGyreHotspots("NAG", "North Atlantic Garbage Patch",                    "Atlantic",  32.0,  -38.0, 7, 12, 35, 3000);
  const sag = generateGyreHotspots("SAG", "South Atlantic Subtropical Gyre",                 "Atlantic", -28.0,  -14.0, 7, 11, 25, 4000);
  const iog = generateGyreHotspots("IOG", "Indian Ocean Subtropical Gyre",                   "Indian",  -28.0,   82.0, 7, 18, 30, 5000);

  res.json({
    success: true,
    center: [20, 0],
    zoom: 3,
    layers: {
      hotspots: [...npg, ...spg, ...nag, ...sag, ...iog, ...RIVER_HOTSPOTS, ...SHIPPING_HOTSPOTS],
      currents: CURRENT_GRID,
      gyrePolygons: GYRE_POLYGONS,
      riverSources: RIVER_HOTSPOTS,
      shippingZones: SHIPPING_HOTSPOTS,
    },
    meta: {
      total_hotspots: npg.length + spg.length + nag.length + sag.length + iog.length + RIVER_HOTSPOTS.length + SHIPPING_HOTSPOTS.length,
      gyres: GYRE_POLYGONS.map(g => ({ id: g.id, name: g.name })),
    }
  });
});

// ============================================================
// Route: GET /api/map/global-stats
// ============================================================
router.get("/global-stats", (req, res) => {
  res.json({
    success: true,
    stats: {
      total_hotspots_detected: 225,
      total_ocean_coverage_km2: 4850000,
      total_estimated_mass_tons: 224000,
      highest_concentration_zone: "Great Pacific Garbage Patch",
      top_polluter_rivers: [
        { name: "Yangtze River", country: "China",            annual_tons: 340, ocean: "Pacific"  },
        { name: "Ganges-Brahmaputra", country: "India/BD",   annual_tons: 295, ocean: "Indian"   },
        { name: "Mekong River",  country: "Vietnam",          annual_tons: 220, ocean: "Pacific"  },
        { name: "Niger Delta",   country: "Nigeria",          annual_tons: 198, ocean: "Atlantic" },
        { name: "Mississippi",   country: "USA",              annual_tons: 168, ocean: "Atlantic" },
      ],
      gyre_accumulations: {
        north_pacific:  { mass_tons: 79000,  area_km2: 1600000, color: "#f72585" },
        south_pacific:  { mass_tons: 37000,  area_km2: 1100000, color: "#ffb703" },
        north_atlantic: { mass_tons: 56000,  area_km2: 700000,  color: "#7209b7" },
        south_atlantic: { mass_tons: 21000,  area_km2: 550000,  color: "#4cc9f0" },
        indian_ocean:   { mass_tons: 31000,  area_km2: 900000,  color: "#06d6a0" },
      },
      last_updated: new Date().toISOString()
    }
  });
});

module.exports = router;
