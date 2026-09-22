import React, { useState, useEffect } from "react";
import { Microscope, Play, Filter, Download, ShieldCheck, CheckCircle2, Globe, MapPin } from "lucide-react";
import { runSegFormerInference, appendLedgerBlock } from "../services/api";

const POLYMER_COLORS = {
  ABS: "#f72585",
  Nylon: "#7209b7",
  PE: "#4cc9f0",
  PET: "#4361ee",
  PS: "#06d6a0",
  PVC: "#ffd166"
};

// Realistic ocean sampling locations for geocoding ML detections onto the global map
const OCEAN_SAMPLE_LOCATIONS = [
  { lat: 35.48,  lon: -148.22, zone: "Great Pacific Garbage Patch" },
  { lat: 32.15,  lon: -42.88,  zone: "North Atlantic Gyre" },
  { lat: -29.72, lon: 82.45,   zone: "Indian Ocean Gyre" },
  { lat: 13.01,  lon: 80.28,   zone: "Bay of Bengal / Chennai Coast" },
  { lat: 21.25,  lon: 89.05,   zone: "Ganges Delta Plume" },
  { lat: 4.25,   lon: 6.55,    zone: "Niger Delta" },
  { lat: 30.95,  lon: 122.15,  zone: "Yangtze Estuary" },
];

export default function SegFormerStudio({ onLedgerUpdated, onDetectionGeolocated }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedPolymer, setSelectedPolymer] = useState("ALL");
  const [selectedParticle, setSelectedParticle] = useState(null);
  const [ledgerLogged,  setLedgerLogged]  = useState(false);
  const [geocoded,      setGeocoded]      = useState(false);

  const executeInference = async (polyFilter = selectedPolymer) => {
    setLoading(true);
    setLedgerLogged(false);
    try {
      const res = await runSegFormerInference("nile_red_sample_frame_04", 0.65, polyFilter);
      if (res.success) {
        setData(res);
        if (res.detections && res.detections.length > 0) {
          setSelectedParticle(res.detections[0]);
        }
      }
    } catch (err) {
      console.error("SegFormer execution failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeInference("ALL");
  }, []);

  const handleFilterChange = (poly) => {
    setSelectedPolymer(poly);
    executeInference(poly);
  };

  const handleCommitToLedger = async () => {
    if (!data || ledgerLogged) return;
    try {
      await appendLedgerBlock({
        eventType: "SEGFOMER_DETECTION_AUDIT",
        location: "Nile Red Fluorescence Lab - Station #2",
        summary: `SegFormer sub-pixel analysis verified ${data.summary.totalParticles} microplastics (${data.summary.meanFeretDiameterUm} µm avg Feret diameter)`,
        attributedParty: "Marine Ingestion Monitoring",
        severity: data.summary.totalParticles > 6 ? "HIGH" : "MEDIUM",
        payload: {
          model: data.summary.model,
          totalAreaUm2: data.summary.totalAreaUm2,
          polymerDistribution: data.summary.polymerDistribution
        }
      });
      setLedgerLogged(true);
      if (onLedgerUpdated) onLedgerUpdated();
    } catch (err) {
      console.error("Commit to ledger error:", err);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Visual Canvas & Polygon Overlay Area */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Controls Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
          <div>
            <div className="badge-glow badge-cyan" style={{ marginBottom: "6px" }}>
              <Microscope size={12} /> Sub-Pixel Semantic Segmentation
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>SegFormer-B2 Microplastics Inference</h2>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => executeInference()}
              disabled={loading}
              className="btn-glow-cyan"
              style={{ fontSize: "0.85rem" }}
            >
              <Play size={14} /> {loading ? "Computing Active Contours..." : "Run SegFormer Engine"}
            </button>
          </div>
        </div>

        {/* Polymer Filter Pills */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
            <Filter size={12} /> Filter Polymer:
          </span>
          {["ALL", "ABS", "Nylon", "PE", "PET", "PS", "PVC"].map((p) => {
            const isSel = selectedPolymer === p;
            return (
              <button
                key={p}
                onClick={() => handleFilterChange(p)}
                style={{
                  background: isSel ? "rgba(0, 242, 254, 0.2)" : "rgba(255, 255, 255, 0.05)",
                  border: isSel ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  color: isSel ? "var(--accent-cyan)" : "var(--text-secondary)",
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Fluorescence Microscope Canvas View */}
        <div style={{
          position: "relative",
          flex: 1,
          background: "radial-gradient(circle at center, #050d22 0%, #020612 100%)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-glass)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {/* Microscope Viewport Grid and Crosshairs */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(0, 242, 254, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 254, 0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />

          {/* SVG Sub-Pixel Polygon Rendering */}
          <svg viewBox="0 0 640 640" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
            {data?.detections?.map((d) => {
              const polyColor = POLYMER_COLORS[d.polymer] || "#00f2fe";
              const isSelected = selectedParticle?.particle_id === d.particle_id;
              const pointsStr = d.polygon_subpixel?.map((pt) => `${pt[0]},${pt[1]}`).join(" ");

              return (
                <g key={d.particle_id} onClick={() => setSelectedParticle(d)} style={{ cursor: "pointer" }}>
                  {/* Glow filter */}
                  <polygon
                    points={pointsStr}
                    fill={polyColor}
                    fillOpacity={isSelected ? 0.45 : 0.25}
                    stroke={polyColor}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  {/* Label */}
                  {d.polygon_subpixel && d.polygon_subpixel[0] && (
                    <text
                      x={d.polygon_subpixel[0][0]}
                      y={d.polygon_subpixel[0][1] - 8}
                      fill={polyColor}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                    >
                      {d.polymer} ({d.feret_max_um}µm)
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Canvas Calibration Legend */}
          <div style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            background: "rgba(3, 8, 22, 0.8)",
            padding: "6px 12px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>Scale: 0.65 px/µm</span>
            <span style={{ display: "inline-block", width: "65px", height: "3px", background: "var(--accent-cyan)" }} />
            <span>100 µm</span>
          </div>
        </div>
      </div>

      {/* Particle Physical Quantification Inspector */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div>
          <div className="badge-glow badge-emerald" style={{ marginBottom: "6px" }}>
            Particle Caliper
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Geometric & Stokes Analysis</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Physical particle metrics calibrated for marine microplastic quantification.
          </p>
        </div>

        {selectedParticle ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Header Card */}
            <div style={{
              background: "rgba(16, 30, 64, 0.6)",
              border: `1px solid ${POLYMER_COLORS[selectedParticle.polymer] || 'var(--border-glass)'}`,
              borderRadius: "var(--radius-sm)",
              padding: "14px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: POLYMER_COLORS[selectedParticle.polymer] }}>
                  {selectedParticle.polymer} ({selectedParticle.particle_id})
                </span>
                <span className="badge-glow badge-cyan">
                  {(selectedParticle.confidence * 100).toFixed(1)}% Conf
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Morphology: {selectedParticle.morphology} • Density: {selectedParticle.density_g_cm3} g/cm³
              </p>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Feret Max Diameter</span>
                <strong style={{ fontSize: "1rem", color: "var(--accent-cyan)" }}>{selectedParticle.feret_max_um} µm</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Surface Area</span>
                <strong style={{ fontSize: "1rem" }}>{selectedParticle.area_um2} µm²</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Aspect Ratio</span>
                <strong style={{ fontSize: "1rem" }}>{selectedParticle.aspect_ratio}</strong>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Circularity</span>
                <strong style={{ fontSize: "1rem", color: "var(--accent-emerald)" }}>{selectedParticle.circularity}</strong>
              </div>
            </div>

            {/* Stokes Hydrodynamics Card */}
            <div style={{ background: "rgba(0, 242, 254, 0.05)", border: "1px solid rgba(0, 242, 254, 0.2)", borderRadius: "var(--radius-sm)", padding: "12px" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: 600, textTransform: "uppercase" }}>
                Stokes Settling in Seawater
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{selectedParticle.buoyancy_behavior}</span>
                <span style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono", color: "var(--text-secondary)" }}>
                  {selectedParticle.stokes_velocity_m_s} m/s
                </span>
              </div>
              <span className="badge-glow badge-amber" style={{ marginTop: "8px", fontSize: "0.7rem" }}>
                {selectedParticle.size_category}
              </span>
            </div>

            {/* Commit to Ledger Button */}
            <button
              onClick={handleCommitToLedger}
              disabled={ledgerLogged}
              className="btn-glow-cyan"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "10px",
                background: ledgerLogged ? "rgba(6, 214, 160, 0.2)" : undefined,
                borderColor: ledgerLogged ? "var(--accent-emerald)" : undefined,
                color: ledgerLogged ? "var(--accent-emerald)" : undefined
              }}
            >
              {ledgerLogged ? (
                <>
                  <CheckCircle2 size={16} /> Appended to Plastic Ledger Block
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> Commit Inspection to Cryptographic Ledger
                </>
              )}
            </button>

            {/* Place on Global Ocean Map */}
            <button
              onClick={() => {
                if (!selectedParticle || geocoded) return;
                const loc = OCEAN_SAMPLE_LOCATIONS[Math.floor(Math.random() * OCEAN_SAMPLE_LOCATIONS.length)];
                const detection = {
                  lat:          loc.lat,
                  lon:          loc.lon,
                  zone:         loc.zone,
                  polymer:      selectedParticle.polymer,
                  confidence:   selectedParticle.confidence,
                  feret_max_um: selectedParticle.feret_max_um,
                  particle_id:  selectedParticle.particle_id,
                };
                if (onDetectionGeolocated) onDetectionGeolocated(detection);
                setGeocoded(true);
              }}
              disabled={geocoded}
              className="btn-outline"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "4px",
                borderColor: geocoded ? "var(--accent-cyan)" : "var(--border-subtle)",
                color:       geocoded ? "var(--accent-cyan)" : "var(--text-secondary)",
              }}
            >
              {geocoded
                ? <><MapPin size={15} /> Pinned on Global Ocean Map</>
                : <><Globe size={15} /> Place Detection on Global Map</>}
            </button>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
            Select a particle contour from the microscope canvas to inspect.
          </div>
        )}
      </div>
    </div>
  );
}
