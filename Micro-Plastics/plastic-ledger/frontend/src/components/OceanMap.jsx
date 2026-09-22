import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import {
  Globe, Key, Check, Wind, Layers, Compass, Play, Activity,
  X, AlertTriangle, Navigation, RotateCcw, Target, Map as MapIcon
} from "lucide-react";
import GlobalStatsPanel from "./GlobalStatsPanel";

// ============================================================
// Basemap configurations
// ============================================================
const BASEMAP_CONFIGS = {
  dark: {
    name: "CARTO Dark Matter",
    getUrl: (key) => key
      ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${key}`
      : `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,
    options: { attribution: '&copy; CARTO &copy; OpenStreetMap', subdomains: "abcd", maxZoom: 19 }
  },
  voyager: {
    name: "CARTO Voyager",
    getUrl: (key) => key
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${key}`
      : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`,
    options: { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>', subdomains: "abcd", maxZoom: 20 }
  },
  satellite: {
    name: "Esri Satellite",
    getUrl: () => "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: { attribution: '&copy; Esri, Maxar, Earthstar Geographics', maxZoom: 18 }
  },
  osm: {
    name: "OpenStreetMap",
    getUrl: () => "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }
  }
};

const SEVERITY_COLORS = { CRITICAL: "#f72585", HIGH: "#ffb703", MEDIUM: "#4cc9f0", LOW: "#06d6a0" };
const SEVERITY_RADIUS = { CRITICAL: 8, HIGH: 6, MEDIUM: 4, LOW: 3 };

// ============================================================
// OceanMap
// ============================================================
export default function OceanMap({ onSelectHotspot, onTriggerPINN, userDetections = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef  = useRef(null);
  const tileLayerRef    = useRef(null);
  const layersRef       = useRef({
    hotspots: [], gyrePolygons: [], currents: [],
    sourcePins: [], backtrackLine: null, backtrackOriginMarker: null,
    detectionMarkers: [],
  });

  const [mapData,        setMapData]        = useState(null);
  const [globalStats,    setGlobalStats]    = useState(null);
  const [selectedHotspot,setSelectedHotspot]= useState(null);
  const [backtrackResult,setBacktrackResult]= useState(null);
  const [isBacktracking, setIsBacktracking] = useState(false);

  // Layer toggles
  const [showGyreMask,  setShowGyreMask]  = useState(true);
  const [showSources,   setShowSources]   = useState(true);
  const [showCurrents,  setShowCurrents]  = useState(false);

  // Basemap / key
  const [activeBasemap, setActiveBasemap] = useState("dark");
  const [cartoKey,      setCartoKey]      = useState(() => localStorage.getItem("PLASTIC_LEDGER_CARTO_KEY") || import.meta.env.VITE_CARTO_API_KEY || "");
  const [showKeyInput,  setShowKeyInput]  = useState(false);
  const [tempKey,       setTempKey]       = useState(cartoKey);

  // ── Fetch global data ──────────────────────────────────────
  useEffect(() => {
    fetch("http://localhost:5000/api/map/layers")
      .then(r => r.json())
      .then(d => { if (d.success) setMapData(d.layers); })
      .catch(e => console.error("Map layers error:", e));

    fetch("http://localhost:5000/api/map/global-stats")
      .then(r => r.json())
      .then(d => { if (d.success) setGlobalStats(d.stats); })
      .catch(e => console.error("Global stats error:", e));
  }, []);

  // ── Initialize Leaflet map ─────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      preferCanvas: true,
      worldCopyJump: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const cfg = BASEMAP_CONFIGS.dark;
    tileLayerRef.current = L.tileLayer(cfg.getUrl(cartoKey), cfg.options).addTo(map);

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // ── Basemap switcher ───────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    tileLayerRef.current?.remove();
    const cfg = BASEMAP_CONFIGS[activeBasemap] || BASEMAP_CONFIGS.dark;
    tileLayerRef.current = L.tileLayer(cfg.getUrl(cartoKey), cfg.options).addTo(map);
  }, [activeBasemap, cartoKey]);

  // ── Gyre polygons ──────────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapData?.gyrePolygons) return;
    layersRef.current.gyrePolygons.forEach(p => p.remove());
    layersRef.current.gyrePolygons = [];

    if (!showGyreMask) return;

    mapData.gyrePolygons.forEach(gyre => {
      const poly = L.polygon(gyre.polygon, {
        color:       gyre.color,
        weight:      1.5,
        dashArray:   "10, 5",
        fillColor:   gyre.color,
        fillOpacity: 0.10,
        opacity:     0.70,
      }).addTo(map);

      poly.bindTooltip(
        `<b style="color:${gyre.color}">${gyre.name}</b><br/>
         Mass: ~${(gyre.mass_estimate_tons / 1000).toFixed(0)}k tons<br/>
         Area: ${(gyre.area_km2 / 1000000).toFixed(1)}M km²`,
        { sticky: true, className: "glass-tooltip" }
      );
      layersRef.current.gyrePolygons.push(poly);
    });
  }, [mapData, showGyreMask]);

  // ── Hotspot markers (200+) ─────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapData?.hotspots) return;
    layersRef.current.hotspots.forEach(m => m.remove());
    layersRef.current.hotspots = [];

    mapData.hotspots.forEach(hs => {
      const color  = SEVERITY_COLORS[hs.severity] || "#4cc9f0";
      const radius = SEVERITY_RADIUS[hs.severity] || 4;

      const marker = L.circleMarker([hs.lat, hs.lon], {
        radius,
        fillColor:   color,
        color:       "rgba(255,255,255,0.35)",
        weight:      1,
        fillOpacity: 0.88,
      }).addTo(map);

      marker.on("click", () => {
        setSelectedHotspot(hs);
        setBacktrackResult(null);
        if (onSelectHotspot) onSelectHotspot(hs);
        map.flyTo([hs.lat, hs.lon], Math.max(map.getZoom(), 6), { animate: true, duration: 1.0 });
      });

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:200px;color:#111;">
           <strong style="color:${color};font-size:13px;">${hs.id} — ${hs.severity}</strong><br/>
           <span><b>Zone:</b> ${hs.gyre}</span><br/>
           <span><b>Ocean:</b> ${hs.ocean}</span><br/>
           <span><b>Polymer:</b> ${hs.polymer}</span><br/>
           <span><b>Concentration:</b> ${hs.particles_m3} pts/m³</span><br/>
           <span><b>Mass:</b> ${hs.mass_tons} tons</span><br/>
           <span><b>Sensor:</b> ${hs.source}</span>
         </div>`,
        { maxWidth: 250 }
      );
      layersRef.current.hotspots.push(marker);
    });
  }, [mapData]);

  // ── River / Shipping source pins ───────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapData) return;
    layersRef.current.sourcePins.forEach(m => m.remove());
    layersRef.current.sourcePins = [];
    if (!showSources) return;

    const all = [...(mapData.riverSources || []), ...(mapData.shippingZones || [])];
    all.forEach(src => {
      const isShip  = src.id.startsWith("SHIP");
      const bg      = isShip ? "#ffd166" : "#06d6a0";
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:10px;height:10px;background:${bg};transform:rotate(45deg);border:1.5px solid rgba(255,255,255,0.7);border-radius:2px;box-shadow:0 0 8px rgba(0,0,0,0.5);"></div>`,
        iconSize:   [10, 10],
        iconAnchor: [5, 5],
      });
      const m = L.marker([src.lat, src.lon], { icon }).addTo(map);
      m.bindPopup(
        `<div style="font-family:Inter,sans-serif;color:#111;min-width:160px;">
           <strong style="color:${bg}">${src.id}</strong><br/>
           <span>${src.gyre || ""}</span>
         </div>`
      );
      layersRef.current.sourcePins.push(m);
    });
  }, [mapData, showSources]);

  // ── Ocean current arrows ───────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapData?.currents) return;
    layersRef.current.currents.forEach(m => m.remove());
    layersRef.current.currents = [];
    if (!showCurrents) return;

    mapData.currents.forEach(c => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="transform:rotate(${c.direction}deg);color:#4facfe;font-size:12px;opacity:0.7;filter:drop-shadow(0 0 3px rgba(0,0,0,0.8));">➔</div>`,
        iconSize: [14, 14],
      });
      layersRef.current.currents.push(L.marker([c.lat, c.lon], { icon }).addTo(map));
    });
  }, [mapData, showCurrents]);

  // ── User ML detections (from SegFormerStudio "Place on Map") ─
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    layersRef.current.detectionMarkers.forEach(m => m.remove());
    layersRef.current.detectionMarkers = [];

    userDetections.forEach(det => {
      const m = L.circleMarker([det.lat, det.lon], {
        radius: 9, fillColor: "#00f2fe", color: "#fff", weight: 2.5, fillOpacity: 1,
      }).addTo(map);
      m.bindPopup(
        `<div style="font-family:Inter,sans-serif;color:#111;min-width:180px;">
           <strong style="color:#00f2fe;">ML Detection — ${det.polymer}</strong><br/>
           <span><b>Confidence:</b> ${(det.confidence * 100).toFixed(1)}%</span><br/>
           <span><b>Feret Ø:</b> ${det.feret_max_um} µm</span>
         </div>`
      );
      layersRef.current.detectionMarkers.push(m);
    });
  }, [userDetections]);

  // ── Backtrack animation ────────────────────────────────────
  const runBacktrack = useCallback(async (hotspot) => {
    if (!hotspot || isBacktracking) return;
    const map = mapInstanceRef.current;
    setIsBacktracking(true);
    setBacktrackResult(null);

    // Clear previous
    layersRef.current.backtrackLine?.remove();
    layersRef.current.backtrackOriginMarker?.remove();
    layersRef.current.backtrackLine = null;
    layersRef.current.backtrackOriginMarker = null;

    try {
      const res  = await fetch("http://localhost:5000/api/physics/backtrack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: hotspot.lat, lon: hotspot.lon, polymer: hotspot.polymer, hours: 720 }),
      });
      const data = await res.json();

      if (!data.success) { setIsBacktracking(false); return; }

      setBacktrackResult(data.data);
      const waypoints = data.data.waypoints || [];

      // Draw animated dashed line
      const lineCoords = [];
      const polyline = L.polyline([], {
        color:     "#f72585",
        weight:    2.5,
        dashArray: "10, 7",
        opacity:   0.9,
      }).addTo(map);
      layersRef.current.backtrackLine = polyline;

      // Animate: batch 3 waypoints per frame for smooth 30-day trails
      let idx = 0;
      const batchSize = Math.max(1, Math.floor(waypoints.length / 80));
      const step = () => {
        if (idx < waypoints.length) {
          const end = Math.min(idx + batchSize, waypoints.length);
          for (let j = idx; j < end; j++) {
            lineCoords.push([waypoints[j].lat, waypoints[j].lon]);
          }
          polyline.setLatLngs(lineCoords);
          idx = end;
          setTimeout(step, 30);
        } else {
          // Place pulsing origin marker
          const origin = waypoints[waypoints.length - 1];
          const oIcon = L.divIcon({
            className: "",
            html: `<div class="origin-pulse"></div>`,
            iconSize:   [20, 20],
            iconAnchor: [10, 10],
          });
          const oMarker = L.marker([origin.lat, origin.lon], { icon: oIcon }).addTo(map);
          oMarker.bindPopup(
            `<div style="font-family:Inter,sans-serif;color:#111;min-width:160px;">
               <strong style="color:#f72585;">Estimated Origin Region</strong><br/>
               <span>PINN Backward: −${data.data.backward_days || 30} days (${waypoints.length} steps)</span><br/>
               <span>Lat: ${origin.lat.toFixed(3)}, Lon: ${origin.lon.toFixed(3)}</span>
             </div>`
          ).openPopup();
          layersRef.current.backtrackOriginMarker = oMarker;

          // Fit both ends of the trail
          if (lineCoords.length > 1) {
            const bounds = L.latLngBounds(lineCoords);
            map.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1.2 });
          }
          setIsBacktracking(false);
        }
      };
      step();
    } catch (e) {
      console.error("Backtrack error:", e);
      setIsBacktracking(false);
    }
  }, [isBacktracking]);

  const clearBacktrack = () => {
    layersRef.current.backtrackLine?.remove();
    layersRef.current.backtrackOriginMarker?.remove();
    layersRef.current.backtrackLine = null;
    layersRef.current.backtrackOriginMarker = null;
    setBacktrackResult(null);
  };

  const handleSaveKey = () => {
    const t = tempKey.trim();
    setCartoKey(t);
    localStorage.setItem("PLASTIC_LEDGER_CARTO_KEY", t);
    setShowKeyInput(false);
  };

  const primaryAttribution = backtrackResult?.attributions?.[0];

  // ============================================================
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 370px", gap: "20px", height: "calc(100vh - 120px)" }}>

      {/* ── Map Viewport ────────────────────────────────────── */}
      <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-glass)" }}>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

        {/* Floating Controls */}
        <div style={{
          position: "absolute", top: "16px", left: "16px", zIndex: 500,
          background: "rgba(7, 13, 30, 0.92)", backdropFilter: "blur(14px)",
          border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)",
          padding: "10px 14px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap",
          maxWidth: "calc(100% - 310px)"
        }}>
          {/* Basemap */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <MapIcon size={13} style={{ color: "var(--accent-cyan)" }} />
            <select value={activeBasemap} onChange={e => setActiveBasemap(e.target.value)}
              style={{ background: "rgba(16,30,64,0.95)", color: "#e2e8f0", border: "1px solid var(--border-glass)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer", outline: "none" }}>
              <option value="dark">CARTO Dark</option>
              <option value="voyager">CARTO Voyager</option>
              <option value="satellite">Esri Satellite</option>
              <option value="osm">OpenStreetMap</option>
            </select>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border-subtle)" }} />

          {/* Layer toggles */}
          <button onClick={() => setShowGyreMask(v => !v)} className="btn-outline"
            style={{ padding: "4px 9px", fontSize: "0.7rem", borderColor: showGyreMask ? "var(--accent-cyan)" : "var(--border-subtle)", color: showGyreMask ? "var(--accent-cyan)" : "var(--text-secondary)" }}>
            <Globe size={12} /> Gyres {showGyreMask ? "ON" : "OFF"}
          </button>
          <button onClick={() => setShowSources(v => !v)} className="btn-outline"
            style={{ padding: "4px 9px", fontSize: "0.7rem", borderColor: showSources ? "var(--accent-emerald)" : "var(--border-subtle)", color: showSources ? "var(--accent-emerald)" : "var(--text-secondary)" }}>
            <Target size={12} /> Sources {showSources ? "ON" : "OFF"}
          </button>
          <button onClick={() => setShowCurrents(v => !v)} className="btn-outline"
            style={{ padding: "4px 9px", fontSize: "0.7rem", borderColor: showCurrents ? "#4facfe" : "var(--border-subtle)", color: showCurrents ? "#4facfe" : "var(--text-secondary)" }}>
            <Wind size={12} /> Currents {showCurrents ? "ON" : "OFF"}
          </button>

          <div style={{ width: "1px", height: "16px", background: "var(--border-subtle)" }} />
          <button onClick={() => setShowKeyInput(v => !v)} className="btn-outline"
            title="Configure CARTO API Key"
            style={{ padding: "4px 9px", fontSize: "0.7rem", borderColor: cartoKey ? "var(--accent-emerald)" : "var(--border-subtle)", color: cartoKey ? "var(--accent-emerald)" : "var(--text-secondary)" }}>
            <Key size={12} /> {cartoKey ? "Key ✓" : "CARTO Key"}
          </button>
        </div>

        {/* CARTO Key Input Dropdown */}
        {showKeyInput && (
          <div style={{ position: "absolute", top: "60px", left: "16px", zIndex: 600, background: "rgba(7,13,30,0.97)", backdropFilter: "blur(16px)", border: "1px solid var(--accent-cyan)", borderRadius: "var(--radius-sm)", padding: "14px", width: "340px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Key size={13} /> CARTO Basemap API Key
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" placeholder="Paste your CARTO API key..." value={tempKey} onChange={e => setTempKey(e.target.value)}
                style={{ flex: 1, background: "rgba(16,30,64,0.8)", border: "1px solid var(--border-glass)", borderRadius: "4px", padding: "6px 10px", color: "#fff", fontSize: "0.75rem" }} />
              <button onClick={handleSaveKey} className="btn-glow-cyan" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                <Check size={13} /> Apply
              </button>
            </div>
            {cartoKey && (
              <button onClick={() => { setTempKey(""); setCartoKey(""); localStorage.removeItem("PLASTIC_LEDGER_CARTO_KEY"); setShowKeyInput(false); }}
                style={{ background: "none", border: "none", color: "var(--accent-rose)", fontSize: "0.68rem", marginTop: "8px", cursor: "pointer", padding: 0 }}>
                Clear saved key
              </button>
            )}
          </div>
        )}

        {/* Global Stats HUD (top-right) */}
        {globalStats && <GlobalStatsPanel stats={globalStats} />}

        {/* Legend (bottom-left) */}
        <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 500, background: "rgba(7,13,30,0.88)", backdropFilter: "blur(12px)", border: "1px solid var(--border-glass)", borderRadius: "var(--radius-sm)", padding: "10px 13px", fontSize: "0.68rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {Object.entries(SEVERITY_COLORS).map(([sev, col]) => (
            <span key={sev} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: col, boxShadow: `0 0 5px ${col}` }} />
              {sev}
            </span>
          ))}
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", background: "#06d6a0", transform: "rotate(45deg)", display: "inline-block" }} />
            River Emitter
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "9px", height: "9px", background: "#ffd166", transform: "rotate(45deg)", display: "inline-block" }} />
            Shipping Zone
          </span>
        </div>

        {/* Backtracking spinner */}
        {isBacktracking && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 600, background: "rgba(7,13,30,0.92)", border: "1px solid var(--accent-rose)", borderRadius: "var(--radius-sm)", padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px", backdropFilter: "blur(12px)" }}>
            <div style={{ width: "16px", height: "16px", border: "2px solid rgba(247,37,133,0.3)", borderTopColor: "#f72585", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f72585" }}>Running PINN Backward Drift…</span>
          </div>
        )}
      </div>

      {/* ── Right Sidebar ────────────────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>

        {/* Header */}
        <div>
          <div className="badge-glow badge-cyan" style={{ marginBottom: "8px" }}>
            <Navigation size={12} /> Global Ocean Surveillance
          </div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Planetary Debris Tracker</h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {mapData ? `${mapData.hotspots?.length || 0} hotspots` : "Loading…"} across 5 ocean gyres.
            Click any marker to inspect & backtrack to origin.
          </p>
        </div>

        {/* Selected Hotspot Info */}
        {selectedHotspot ? (
          <div style={{ background: "rgba(16,30,64,0.55)", border: `1px solid ${SEVERITY_COLORS[selectedHotspot.severity] || "var(--border-glass)"}`, borderRadius: "var(--radius-sm)", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: SEVERITY_COLORS[selectedHotspot.severity] }}>
                  {selectedHotspot.id}
                </span>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {selectedHotspot.gyre}
                </div>
              </div>
              <span className={`badge-glow ${selectedHotspot.severity === "CRITICAL" ? "badge-rose" : selectedHotspot.severity === "HIGH" ? "badge-amber" : "badge-cyan"}`}
                style={{ fontSize: "0.62rem" }}>
                {selectedHotspot.severity}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.76rem" }}>
              {[
                ["Polymer", selectedHotspot.polymer, "var(--accent-cyan)"],
                ["Ocean",   selectedHotspot.ocean,   "#fff"],
                ["Conc.",   `${selectedHotspot.particles_m3} pts/m³`, "var(--accent-emerald)"],
                ["Mass",    `${selectedHotspot.mass_tons} t`, "var(--accent-amber)"],
              ].map(([label, val, color]) => (
                <div key={label}>
                  <span style={{ color: "var(--text-muted)", display: "block", fontSize: "0.65rem" }}>{label}</span>
                  <strong style={{ color }}>{val}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => runBacktrack(selectedHotspot)} disabled={isBacktracking} className="btn-glow-cyan"
                style={{ flex: 1, justifyContent: "center", fontSize: "0.78rem", opacity: isBacktracking ? 0.6 : 1 }}>
                <Activity size={13} /> {isBacktracking ? "Backtracking…" : "Run PINN Backtrack"}
              </button>
              {backtrackResult && (
                <button onClick={clearBacktrack} className="btn-outline"
                  style={{ padding: "6px 10px", fontSize: "0.78rem" }} title="Clear drift trail">
                  <RotateCcw size={13} />
                </button>
              )}
            </div>

            {/* Also trigger full PINN Simulator tab */}
            <button onClick={() => onTriggerPINN && onTriggerPINN(selectedHotspot)} className="btn-outline"
              style={{ fontSize: "0.75rem", justifyContent: "center" }}>
              <Play size={12} /> Open DeepXDE PINN Simulator
            </button>
          </div>
        ) : (
          <div style={{ padding: "20px 14px", textAlign: "center", border: "1px dashed var(--border-glass)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", fontSize: "0.82rem" }}>
            Click any debris marker on the map to inspect & run backward drift attribution.
          </div>
        )}

        {/* Backtrack Attribution Results */}
        {backtrackResult && backtrackResult.attributions?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "0.75rem", color: "var(--accent-rose)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={13} /> PINN Origin Attribution
            </h4>
            <div style={{ background: "linear-gradient(135deg, rgba(247,37,133,0.12), rgba(114,9,183,0.12))", border: "1px solid rgba(247,37,133,0.35)", borderRadius: "var(--radius-sm)", padding: "12px" }}>
              <div style={{ fontSize: "0.65rem", color: "var(--accent-rose)", marginBottom: "3px", fontWeight: 700 }}>Primary Emitter</div>
              <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>{primaryAttribution?.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{primaryAttribution?.country} • {primaryAttribution?.distance_km} km drift</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--accent-rose)", fontFamily: "var(--font-mono)", marginTop: "6px" }}>
                {((primaryAttribution?.confidence || 0) * 100).toFixed(1)}% <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>PINN confidence</span>
              </div>
            </div>

            {backtrackResult.attributions.slice(1).map(src => (
              <div key={src.source_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(16,30,64,0.4)", border: "1px solid var(--border-subtle)", borderRadius: "6px", padding: "9px 12px", fontSize: "0.76rem" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{src.name}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{src.country} • {src.distance_km} km</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent-emerald)" }}>
                  {((src.confidence || 0) * 100).toFixed(1)}%
                </div>
              </div>
            ))}

            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", background: "rgba(3,8,22,0.5)", padding: "8px 10px", borderRadius: "6px" }}>
              Drift estimated over <strong style={{ color: "var(--accent-cyan)" }}>{backtrackResult.backward_days || Math.round((backtrackResult.backward_hours || 720) / 24)} days</strong> of inverse PINN adjoint transport.
              Total drift distance: <strong style={{ color: "var(--accent-cyan)" }}>{backtrackResult.total_drift_distance_km} km</strong>.
              {backtrackResult.detected_basin && <> Basin: <strong style={{ color: "var(--accent-amber)" }}>{backtrackResult.detected_basin}</strong>.</>}
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
          <h4 style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Sensor Ingestion Summary</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "0.76rem" }}>
            {[
              ["Active Gyres Monitored", "5 Ocean Systems", "var(--accent-cyan)"],
              ["Detected Debris Fields", `${mapData?.hotspots?.length || "—"} Hotspots`, "#fff"],
              ["Global Emitter Sources", "40+ Rivers / Ports", "var(--accent-amber)"],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <strong style={{ color }}>{val}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
