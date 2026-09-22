import React, { useState, useEffect } from "react";
import { Satellite, Sliders, Play, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";
import { fetchSatelliteOverview, computeFDI } from "../services/api";

export default function SatelliteViewer() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Spectral Calculator states
  const [redVal, setRedVal] = useState(0.025);
  const [nirVal, setNirVal] = useState(0.095);
  const [swirVal, setSwirVal] = useState(0.035);
  const [sensorType, setSensorType] = useState("Sentinel-2 MSI");
  const [calcResult, setCalcResult] = useState(null);

  useEffect(() => {
    fetchSatelliteOverview()
      .then((data) => {
        setOverview(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Satellite overview error:", err);
        setLoading(false);
      });
  }, []);

  const handleComputeFDI = async () => {
    try {
      const res = await computeFDI({
        red: parseFloat(redVal),
        nir: parseFloat(nirVal),
        swir1: parseFloat(swirVal),
        sensor: sensorType
      });
      setCalcResult(res);
    } catch (err) {
      console.error("Compute FDI error:", err);
    }
  };

  useEffect(() => {
    handleComputeFDI();
  }, [redVal, nirVal, swirVal, sensorType]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Multispectral Passes & Cross-Sensor Comparison */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div>
          <div className="badge-glow badge-cyan" style={{ marginBottom: "6px" }}>
            <Satellite size={12} /> Earth Observation Satellite API
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Sentinel-2 & Landsat-9 Multispectral Pipeline</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Harmonized surface reflectance across Copernicus CDSE and USGS OLI-2.
          </p>
        </div>

        {/* Side-by-Side Satellite Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Sentinel-2 Card */}
          <div style={{
            background: "rgba(16, 30, 64, 0.6)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(0, 242, 254, 0.3)",
            padding: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, color: "var(--accent-cyan)", fontSize: "1rem" }}>
                Sentinel-2B MSI
              </span>
              <span className="badge-glow badge-cyan" style={{ fontSize: "0.65rem" }}>10m - 20m</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              Tile ID: {overview?.sentinel2?.tile_id || "T44VNR"} • Cloud: {overview?.sentinel2?.cloud_cover_percent || "2.8"}%
            </p>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Target Indices:</span>
                <strong>FDI, NDVI, Plastic Index</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Debris Hotspots:</span>
                <strong style={{ color: "var(--accent-rose)" }}>
                  {overview?.sentinel2?.total_anomalies_detected || 4} Detected
                </strong>
              </div>
            </div>
          </div>

          {/* Landsat-9 Card */}
          <div style={{
            background: "rgba(16, 30, 64, 0.6)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255, 183, 3, 0.3)",
            padding: "16px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, color: "var(--accent-amber)", fontSize: "1rem" }}>
                Landsat-9 OLI-2
              </span>
              <span className="badge-glow badge-amber" style={{ fontSize: "0.65rem" }}>30m Res</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
              Path/Row: {overview?.landsat9?.path_row || "142_051"} • USGS Level-2
            </p>

            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Cross-Calibration:</span>
                <strong style={{ color: "var(--accent-emerald)" }}>Harmonized with MSI</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Surface Clusters:</span>
                <strong style={{ color: "var(--accent-amber)" }}>
                  {overview?.landsat9?.detected_clusters?.length || 4} Clusters
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Marine Hotspots Table */}
        <div style={{ marginTop: "10px" }}>
          <h4 style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", marginBottom: "10px", textTransform: "uppercase" }}>
            Spectral Floating Debris Detections
          </h4>

          <div style={{
            background: "rgba(3, 8, 22, 0.6)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Anomaly ID</th>
                  <th style={{ padding: "10px" }}>Coordinates</th>
                  <th style={{ padding: "10px" }}>FDI</th>
                  <th style={{ padding: "10px" }}>NDVI</th>
                  <th style={{ padding: "10px" }}>Category</th>
                  <th style={{ padding: "10px" }}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {overview?.sentinel2?.anomalies?.map((a) => (
                  <tr key={a.anomaly_id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "10px", fontWeight: 600 }}>{a.anomaly_id}</td>
                    <td style={{ padding: "10px", fontFamily: "JetBrains Mono" }}>{a.lat}, {a.lon}</td>
                    <td style={{ padding: "10px", color: "var(--accent-cyan)" }}>{a.indices?.FDI}</td>
                    <td style={{ padding: "10px" }}>{a.indices?.NDVI}</td>
                    <td style={{ padding: "10px" }}>
                      <span className={`badge-glow ${a.category === 'PLASTIC' ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: "0.65rem" }}>
                        {a.category}
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: "var(--accent-emerald)" }}>{(a.confidence * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Spectral Index FDI Calculator */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <div className="badge-glow badge-emerald" style={{ marginBottom: "6px" }}>
            <Cpu size={12} /> Biermann / Kikaki Spectral Model
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>FDI & Plastic Index Calculator</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Tune multispectral reflectance to observe FDI baseline departure.
          </p>
        </div>

        {/* Sensor selector */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["Sentinel-2 MSI", "Landsat-9 OLI-2"].map((s) => (
            <button
              key={s}
              onClick={() => setSensorType(s)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "var(--radius-sm)",
                border: sensorType === s ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                background: sensorType === s ? "rgba(0, 242, 254, 0.15)" : "transparent",
                color: sensorType === s ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: "pointer"
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.8rem" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>Red Band Reflectance (665 nm)</span>
              <strong style={{ fontFamily: "JetBrains Mono" }}>{redVal}</strong>
            </div>
            <input
              type="range"
              min="0.005"
              max="0.08"
              step="0.001"
              value={redVal}
              onChange={(e) => setRedVal(e.target.value)}
              style={{ width: "100%", accentColor: "var(--accent-rose)" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>NIR Band Reflectance (842 nm)</span>
              <strong style={{ fontFamily: "JetBrains Mono", color: "var(--accent-cyan)" }}>{nirVal}</strong>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.25"
              step="0.002"
              value={nirVal}
              onChange={(e) => setNirVal(e.target.value)}
              style={{ width: "100%", accentColor: "var(--accent-cyan)" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>SWIR-1 Band Reflectance (1610 nm)</span>
              <strong style={{ fontFamily: "JetBrains Mono" }}>{swirVal}</strong>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.10"
              step="0.001"
              value={swirVal}
              onChange={(e) => setSwirVal(e.target.value)}
              style={{ width: "100%", accentColor: "var(--accent-emerald)" }}
            />
          </div>
        </div>

        {/* Spectral Calculation Output */}
        {calcResult && (
          <div style={{
            background: "rgba(16, 30, 64, 0.6)",
            border: "1px solid var(--border-glass)",
            borderRadius: "var(--radius-sm)",
            padding: "16px",
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Computed FDI Index:</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--accent-cyan)", fontFamily: "JetBrains Mono" }}>
                {calcResult.fdi}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Plastic Index (PI):</span>
              <strong style={{ fontSize: "1rem", color: "var(--accent-emerald)", fontFamily: "JetBrains Mono" }}>
                {calcResult.plastic_index}
              </strong>
            </div>

            <div style={{
              background: calcResult.fdi > 0.02 ? "rgba(247, 37, 133, 0.15)" : "rgba(6, 214, 160, 0.15)",
              border: `1px solid ${calcResult.fdi > 0.02 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}`,
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textAlign: "center",
              marginTop: "4px"
            }}>
              {calcResult.classification}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
