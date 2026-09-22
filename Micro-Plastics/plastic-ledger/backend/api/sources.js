const express = require("express");
const router = express.Router();

// ============================================================
// 50+ Global pollution source emitters
// ============================================================
const GLOBAL_SOURCES = [
  // ── China ──────────────────────────────────────────────────
  { source_id:"SRC-CN-001", name:"Yangtze River Estuary",         country:"China",       type:"River Discharge",    lat:30.95, lon:122.15, annual_discharge_tons:340, primary_polymers:["PE","PET","PS"],        risk_level:"CRITICAL", ocean_basin:"Pacific",       status:"Active Monitoring" },
  { source_id:"SRC-CN-002", name:"Pearl River Delta",              country:"China",       type:"River Discharge",    lat:22.35, lon:113.85, annual_discharge_tons:280, primary_polymers:["PET","ABS","PE"],       risk_level:"CRITICAL", ocean_basin:"Pacific",       status:"Containment Active" },
  { source_id:"SRC-CN-003", name:"Huangpu River Shanghai Outfall", country:"China",       type:"Urban Wastewater",   lat:31.25, lon:121.65, annual_discharge_tons:185, primary_polymers:["PE","PVC","Nylon"],     risk_level:"HIGH",     ocean_basin:"Pacific",       status:"Active Monitoring" },
  { source_id:"SRC-CN-004", name:"Bohai Bay Industrial Zone",      country:"China",       type:"Industrial Port",    lat:39.85, lon:119.25, annual_discharge_tons:220, primary_polymers:["ABS","PVC"],            risk_level:"HIGH",     ocean_basin:"Pacific",       status:"AIS Surveillance" },
  // ── Japan / Korea ──────────────────────────────────────────
  { source_id:"SRC-JP-001", name:"Tokyo Bay Industrial Outfall",   country:"Japan",       type:"Industrial Port",    lat:35.55, lon:139.85, annual_discharge_tons:148, primary_polymers:["ABS","PET","PE"],       risk_level:"HIGH",     ocean_basin:"Pacific",       status:"Active Monitoring" },
  { source_id:"SRC-KR-001", name:"Busan Port Coastal Zone",        country:"South Korea", type:"Industrial Port",    lat:35.05, lon:129.05, annual_discharge_tons:135, primary_polymers:["Nylon","ABS"],          risk_level:"HIGH",     ocean_basin:"Pacific",       status:"AIS Telemetry" },
  // ── Southeast Asia ─────────────────────────────────────────
  { source_id:"SRC-VN-001", name:"Mekong Delta Estuary",           country:"Vietnam",     type:"River Discharge",    lat:10.55, lon:107.35, annual_discharge_tons:220, primary_polymers:["PE","PET"],             risk_level:"CRITICAL", ocean_basin:"Pacific",       status:"Active Monitoring" },
  { source_id:"SRC-ID-001", name:"Jakarta Coastal Runoff",         country:"Indonesia",   type:"Urban Wastewater",   lat:-6.05, lon:106.85, annual_discharge_tons:195, primary_polymers:["PE","PS","PET"],        risk_level:"CRITICAL", ocean_basin:"Pacific/Indian",status:"High Turbidity" },
  { source_id:"SRC-PH-001", name:"Manila Bay Discharge",           country:"Philippines", type:"Urban Wastewater",   lat:14.55, lon:120.95, annual_discharge_tons:165, primary_polymers:["PET","PE"],             risk_level:"HIGH",     ocean_basin:"Pacific",       status:"Monitoring" },
  { source_id:"SRC-TH-001", name:"Chao Phraya River Delta",        country:"Thailand",    type:"River Discharge",    lat:13.55, lon:100.55, annual_discharge_tons:138, primary_polymers:["PE","Nylon"],           risk_level:"HIGH",     ocean_basin:"Indian",        status:"Active Monitoring" },
  { source_id:"SRC-MM-001", name:"Irrawaddy River Delta",          country:"Myanmar",     type:"River Discharge",    lat:16.85, lon:96.25,  annual_discharge_tons:178, primary_polymers:["PVC","PE"],             risk_level:"HIGH",     ocean_basin:"Indian",        status:"Monitoring" },
  // ── South Asia ─────────────────────────────────────────────
  { source_id:"SRC-IN-001", name:"Ganges-Brahmaputra Delta",       country:"India/Bangladesh", type:"River Discharge", lat:21.25, lon:89.05, annual_discharge_tons:295, primary_polymers:["PE","PET","PVC"],      risk_level:"CRITICAL", ocean_basin:"Indian",        status:"Alert Level HIGH" },
  { source_id:"SRC-IN-002", name:"Godavari River Estuary",         country:"India",       type:"River Discharge",    lat:16.20, lon:82.08,  annual_discharge_tons:185, primary_polymers:["Nylon","PE"],           risk_level:"HIGH",     ocean_basin:"Indian",        status:"Active Monitoring" },
  { source_id:"SRC-IN-003", name:"Indus River Delta",              country:"Pakistan",    type:"River Discharge",    lat:24.05, lon:67.25,  annual_discharge_tons:142, primary_polymers:["PS","PET"],             risk_level:"HIGH",     ocean_basin:"Indian",        status:"Monitoring" },
  { source_id:"SRC-IN-004", name:"Mumbai Sewage Outfall",          country:"India",       type:"Urban Wastewater",   lat:18.85, lon:72.75,  annual_discharge_tons:125, primary_polymers:["PE","PVC","ABS"],       risk_level:"HIGH",     ocean_basin:"Indian",        status:"Containment Active" },
  { source_id:"SRC-IN-005", name:"Adyar River Estuary (Chennai)",  country:"India",       type:"River Discharge",    lat:13.01, lon:80.28,  annual_discharge_tons:42,  primary_polymers:["PE","PET","PVC"],       risk_level:"HIGH",     ocean_basin:"Indian",        status:"Active Plume Monitoring" },
  { source_id:"SRC-IN-006", name:"Cooum Canal Sluice (Chennai)",   country:"India",       type:"Urban Wastewater",   lat:13.07, lon:80.29,  annual_discharge_tons:65,  primary_polymers:["PE","PS","PET"],        risk_level:"CRITICAL", ocean_basin:"Indian",        status:"High Surface Debris" },
  { source_id:"SRC-IN-007", name:"Ennore Industrial Port Outflow", country:"India",       type:"Industrial Port",    lat:13.25, lon:80.34,  annual_discharge_tons:88,  primary_polymers:["Nylon","ABS"],          risk_level:"CRITICAL", ocean_basin:"Indian",        status:"Containment Boom Deployed" },
  // ── Middle East ────────────────────────────────────────────
  { source_id:"SRC-AE-001", name:"Dubai Coastal Industrial Zone",  country:"UAE",         type:"Industrial Port",    lat:25.05, lon:55.25,  annual_discharge_tons:115, primary_polymers:["PE","PVC"],             risk_level:"HIGH",     ocean_basin:"Indian",        status:"Monitoring" },
  { source_id:"SRC-SA-001", name:"Jeddah Urban Coastal Runoff",    country:"Saudi Arabia",type:"Urban Wastewater",   lat:21.45, lon:39.15,  annual_discharge_tons:98,  primary_polymers:["PET","PE"],             risk_level:"MEDIUM",   ocean_basin:"Red Sea",       status:"Monitoring" },
  // ── Africa ─────────────────────────────────────────────────
  { source_id:"SRC-NG-001", name:"Niger Delta Estuary",            country:"Nigeria",     type:"River Discharge",    lat:4.25,  lon:6.55,   annual_discharge_tons:198, primary_polymers:["PE","PS","Nylon"],      risk_level:"HIGH",     ocean_basin:"Atlantic",      status:"Alert Level HIGH" },
  { source_id:"SRC-EG-001", name:"Nile Delta Coastal Zone",        country:"Egypt",       type:"River Discharge",    lat:31.45, lon:31.85,  annual_discharge_tons:152, primary_polymers:["PET","PE"],             risk_level:"HIGH",     ocean_basin:"Mediterranean", status:"Active Monitoring" },
  { source_id:"SRC-CD-001", name:"Congo River Mouth",              country:"DRC",         type:"River Discharge",    lat:-4.05, lon:11.55,  annual_discharge_tons:98,  primary_polymers:["PE","PS"],              risk_level:"MEDIUM",   ocean_basin:"Atlantic",      status:"Monitoring" },
  { source_id:"SRC-GH-001", name:"Volta River Estuary",            country:"Ghana",       type:"River Discharge",    lat:5.75,  lon:0.05,   annual_discharge_tons:85,  primary_polymers:["PE","Nylon"],           risk_level:"MEDIUM",   ocean_basin:"Atlantic",      status:"Monitoring" },
  { source_id:"SRC-ZA-001", name:"Cape Town Coastal Runoff",       country:"South Africa",type:"Urban Runoff",       lat:-34.15,lon:18.45,  annual_discharge_tons:72,  primary_polymers:["PE","PET"],             risk_level:"MEDIUM",   ocean_basin:"Atlantic/Indian",status:"Monitoring" },
  { source_id:"SRC-MZ-001", name:"Zambezi River Delta",            country:"Mozambique",  type:"River Discharge",    lat:-18.85,lon:36.45,  annual_discharge_tons:65,  primary_polymers:["PE","PS"],              risk_level:"MEDIUM",   ocean_basin:"Indian",        status:"Monitoring" },
  // ── Americas ───────────────────────────────────────────────
  { source_id:"SRC-US-001", name:"Mississippi River Delta",        country:"USA",         type:"River Discharge",    lat:29.05, lon:-89.45, annual_discharge_tons:168, primary_polymers:["PET","PE","PS"],        risk_level:"HIGH",     ocean_basin:"Atlantic",      status:"Active Monitoring" },
  { source_id:"SRC-US-002", name:"Los Angeles Stormwater Runoff",  country:"USA",         type:"Urban Runoff",       lat:33.75, lon:-118.25,annual_discharge_tons:95,  primary_polymers:["PE","PET","ABS"],       risk_level:"HIGH",     ocean_basin:"Pacific",       status:"Storm Drain Active" },
  { source_id:"SRC-US-003", name:"New York Harbor Outfall",        country:"USA",         type:"Urban Wastewater",   lat:40.55, lon:-74.05, annual_discharge_tons:82,  primary_polymers:["PE","PS","Nylon"],      risk_level:"MEDIUM",   ocean_basin:"Atlantic",      status:"Monitoring" },
  { source_id:"SRC-BR-001", name:"Amazon River Mouth",             country:"Brazil",      type:"River Discharge",    lat:0.35,  lon:-50.25, annual_discharge_tons:82,  primary_polymers:["PS","PE"],              risk_level:"MEDIUM",   ocean_basin:"Atlantic",      status:"Monitoring" },
  { source_id:"SRC-BR-002", name:"Rio de Janeiro Coastal Zone",    country:"Brazil",      type:"Urban Wastewater",   lat:-22.85,lon:-43.25, annual_discharge_tons:118, primary_polymers:["PET","PE","PVC"],       risk_level:"HIGH",     ocean_basin:"Atlantic",      status:"Active Monitoring" },
  { source_id:"SRC-CO-001", name:"Magdalena River Delta",          country:"Colombia",    type:"River Discharge",    lat:10.65, lon:-72.35, annual_discharge_tons:94,  primary_polymers:["PE","Nylon"],           risk_level:"MEDIUM",   ocean_basin:"Pacific",       status:"Monitoring" },
  { source_id:"SRC-MX-001", name:"Gulf of Mexico Industrial Zone", country:"Mexico",      type:"Industrial Port",    lat:19.25, lon:-95.55, annual_discharge_tons:128, primary_polymers:["PVC","ABS","PE"],       risk_level:"HIGH",     ocean_basin:"Atlantic",      status:"Boom Active" },
  // ── Europe ─────────────────────────────────────────────────
  { source_id:"SRC-RO-001", name:"Danube Delta (Black Sea Mouth)", country:"Romania",     type:"River Discharge",    lat:45.35, lon:29.75,  annual_discharge_tons:121, primary_polymers:["PVC","PS"],             risk_level:"HIGH",     ocean_basin:"Black Sea",     status:"Active Monitoring" },
  { source_id:"SRC-NL-001", name:"Rhine River Estuary (Rotterdam)",country:"Netherlands", type:"River Discharge",    lat:51.95, lon:4.25,   annual_discharge_tons:76,  primary_polymers:["PS","PE"],              risk_level:"MEDIUM",   ocean_basin:"North Sea",     status:"Monitoring" },
  { source_id:"SRC-IT-001", name:"Po River Delta",                 country:"Italy",       type:"River Discharge",    lat:44.95, lon:12.45,  annual_discharge_tons:68,  primary_polymers:["PET","PE"],             risk_level:"MEDIUM",   ocean_basin:"Mediterranean", status:"Monitoring" },
  { source_id:"SRC-TR-001", name:"Bosphorus Strait Outflow",       country:"Turkey",      type:"Urban Wastewater",   lat:41.05, lon:29.05,  annual_discharge_tons:112, primary_polymers:["PE","PVC","Nylon"],     risk_level:"HIGH",     ocean_basin:"Mediterranean", status:"Alert Level HIGH" },
  { source_id:"SRC-GR-001", name:"Thessaloniki Industrial Port",   country:"Greece",      type:"Industrial Port",    lat:40.65, lon:22.95,  annual_discharge_tons:58,  primary_polymers:["Nylon","ABS"],          risk_level:"MEDIUM",   ocean_basin:"Mediterranean", status:"Monitoring" },
  // ── International Shipping ─────────────────────────────────
  { source_id:"SRC-SHP-001", name:"Strait of Malacca Vessel Traffic", country:"International", type:"Commercial Shipping", lat:1.25,  lon:104.15, annual_discharge_tons:245, primary_polymers:["Nylon","ABS","PE"], risk_level:"HIGH", ocean_basin:"Indian",   status:"AIS Telemetry Active" },
  { source_id:"SRC-SHP-002", name:"Gulf of Aden Shipping Lane",       country:"International", type:"Commercial Shipping", lat:12.75, lon:44.35,  annual_discharge_tons:198, primary_polymers:["PE","Nylon"],       risk_level:"HIGH", ocean_basin:"Indian",   status:"AIS Telemetry Active" },
  { source_id:"SRC-SHP-003", name:"Suez Canal Maritime Zone",         country:"Egypt",         type:"Commercial Shipping", lat:30.85, lon:32.55,  annual_discharge_tons:112, primary_polymers:["PET","Nylon"],      risk_level:"MEDIUM", ocean_basin:"Red Sea", status:"AIS Surveillance" },
  { source_id:"SRC-SHP-004", name:"English Channel Transit Zone",     country:"International", type:"Commercial Shipping", lat:51.35, lon:3.15,   annual_discharge_tons:98,  primary_polymers:["ABS","Nylon"],      risk_level:"MEDIUM", ocean_basin:"Atlantic", status:"AIS Telemetry Active" },
  { source_id:"SRC-SHP-005", name:"Panama Canal Approach Zone",       country:"Panama",        type:"Commercial Shipping", lat:9.15,  lon:-79.85, annual_discharge_tons:214, primary_polymers:["Nylon","ABS","PE"], risk_level:"HIGH", ocean_basin:"Pacific",  status:"AIS Surveillance" },
];

// ============================================================
// Route: GET /api/sources
// ============================================================
router.get("/", (req, res) => {
  const { ocean_basin, risk_level, country, type } = req.query;
  let filtered = [...GLOBAL_SOURCES];

  if (ocean_basin) filtered = filtered.filter(s => s.ocean_basin.toLowerCase().includes(ocean_basin.toLowerCase()));
  if (risk_level)  filtered = filtered.filter(s => s.risk_level === risk_level.toUpperCase());
  if (country)     filtered = filtered.filter(s => s.country.toLowerCase().includes(country.toLowerCase()));
  if (type)        filtered = filtered.filter(s => s.type.toLowerCase().includes(type.toLowerCase()));

  const totalTons = filtered.reduce((sum, s) => sum + s.annual_discharge_tons, 0);
  const byRisk = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  filtered.forEach(s => { byRisk[s.risk_level] = (byRisk[s.risk_level] || 0) + 1; });

  res.json({
    success: true,
    total_sources: filtered.length,
    total_annual_discharge_tons: totalTons,
    by_risk_level: byRisk,
    sources: filtered,
  });
});

module.exports = router;
