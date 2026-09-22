import React from "react";
import { Globe, Waves, TrendingUp, AlertTriangle, BarChart2 } from "lucide-react";

export default function GlobalStatsPanel({ stats }) {
  if (!stats) return null;

  const maxTons = Math.max(...stats.top_polluter_rivers.map(r => r.annual_tons));

  return (
    <div style={{
      position: "absolute",
      top: "16px",
      right: "16px",
      zIndex: 500,
      width: "270px",
      background: "rgba(7, 13, 30, 0.92)",
      backdropFilter: "blur(18px)",
      border: "1px solid rgba(0, 242, 254, 0.2)",
      borderRadius: "var(--radius-sm)",
      padding: "14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,242,254,0.05)",
      fontFamily: "var(--font-sans)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "10px" }}>
        <Globe size={14} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Global Ocean Intelligence
        </span>
      </div>

      {/* Top 3 KPI metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
        <div style={{
          background: "rgba(247, 37, 133, 0.1)",
          border: "1px solid rgba(247, 37, 133, 0.25)",
          borderRadius: "6px",
          padding: "8px",
          gridColumn: "1 / -1"
        }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "#f72585", lineHeight: 1 }}>
            {(stats.total_estimated_mass_tons / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
            Estimated Total Plastic Tons in Ocean
          </div>
        </div>

        <div style={{ background: "rgba(0,242,254,0.07)", border: "1px solid rgba(0,242,254,0.15)", borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>
            {stats.total_hotspots_detected}
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px" }}>Hotspots Detected</div>
        </div>

        <div style={{ background: "rgba(6,214,160,0.07)", border: "1px solid rgba(6,214,160,0.15)", borderRadius: "6px", padding: "8px" }}>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--accent-emerald)" }}>
            {(stats.total_ocean_coverage_km2 / 1000000).toFixed(1)}M
          </div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px" }}>km² Coverage</div>
        </div>
      </div>

      {/* Gyre Accumulations mini bar chart */}
      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
          <BarChart2 size={11} /> Gyre Mass Distribution
        </div>
        {Object.entries(stats.gyre_accumulations).map(([key, gyre]) => {
          const maxMass = Math.max(...Object.values(stats.gyre_accumulations).map(g => g.mass_tons));
          const pct = (gyre.mass_tons / maxMass) * 100;
          const label = {
            north_pacific:  "N. Pacific",
            south_pacific:  "S. Pacific",
            north_atlantic: "N. Atlantic",
            south_atlantic: "S. Atlantic",
            indian_ocean:   "Indian Ocean"
          }[key];
          return (
            <div key={key} style={{ marginBottom: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", marginBottom: "2px" }}>
                <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ color: gyre.color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  {(gyre.mass_tons / 1000).toFixed(0)}k t
                </span>
              </div>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: gyre.color,
                  borderRadius: "2px",
                  transition: "width 1s ease",
                  boxShadow: `0 0 6px ${gyre.color}`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Top polluter rivers */}
      <div>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "7px", display: "flex", alignItems: "center", gap: "5px" }}>
          <AlertTriangle size={11} style={{ color: "var(--accent-rose)" }} /> Top Emitter Rivers
        </div>
        {stats.top_polluter_rivers.slice(0, 4).map((river, i) => (
          <div key={river.name} style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px" }}>
            <span style={{
              width: "14px", height: "14px", borderRadius: "3px",
              background: ["#f72585", "#ffb703", "#7209b7", "#4cc9f0"][i],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.5rem", fontWeight: 800, color: "#fff", flexShrink: 0
            }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {river.name}
              </div>
              <div style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>{river.country} • {river.ocean}</div>
            </div>
            <span style={{ fontSize: "0.6rem", fontFamily: "var(--font-mono)", color: "var(--accent-amber)", fontWeight: 600 }}>
              {river.annual_tons}t
            </span>
          </div>
        ))}
      </div>

      {/* Footer timestamp */}
      <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.55rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent-emerald)", boxShadow: "0 0 6px var(--accent-emerald)", animation: "pulseGlow 2s infinite" }} />
        Live • Updated {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
