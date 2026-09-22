import React, { useState, useEffect } from "react";
import { Activity, ArrowUpRight, Compass, ShieldAlert, CheckCircle2, Play, Globe, Filter, TrendingDown } from "lucide-react";
import { runReverseAttribution, fetchSources, appendLedgerBlock } from "../services/api";

const OCEAN_BASINS = ["All", "Pacific", "Atlantic", "Indian", "Mediterranean", "Black Sea", "Red Sea", "North Sea"];
const RISK_LEVELS  = ["All", "CRITICAL", "HIGH", "MEDIUM"];

export default function SourceAttribution({ onLedgerUpdated }) {
  const [sources,            setSources]           = useState([]);
  const [filteredSources,    setFilteredSources]   = useState([]);
  const [selectedPolymer,    setSelectedPolymer]   = useState("PE");
  const [selectedBasin,      setSelectedBasin]     = useState("All");
  const [selectedRisk,       setSelectedRisk]      = useState("All");
  const [attributionResult,  setAttributionResult] = useState(null);
  const [loading,            setLoading]           = useState(false);
  const [committed,          setCommitted]         = useState(false);
  const [totalTons,          setTotalTons]         = useState(0);

  // Load sources + run initial attribution
  useEffect(() => {
    fetchSources()
      .then(data => {
        if (data.success) {
          setSources(data.sources);
          setFilteredSources(data.sources);
          setTotalTons(data.total_annual_discharge_tons);
        }
      })
      .catch(err => console.error("Sources fetch error:", err));

    executeReverseAttribution("PE");
  }, []);

  // Filter sources by basin and risk
  useEffect(() => {
    let filtered = [...sources];
    if (selectedBasin !== "All") {
      filtered = filtered.filter(s => s.ocean_basin.includes(selectedBasin));
    }
    if (selectedRisk !== "All") {
      filtered = filtered.filter(s => s.risk_level === selectedRisk);
    }
    setFilteredSources(filtered);
  }, [sources, selectedBasin, selectedRisk]);

  const executeReverseAttribution = async (poly = selectedPolymer) => {
    setLoading(true);
    setCommitted(false);
    try {
      const res = await runReverseAttribution([13.08, 80.32], poly);
      if (res.success) setAttributionResult(res.data);
    } catch (err) {
      console.error("Reverse attribution error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitAttribution = async () => {
    if (!attributionResult || committed) return;
    const primary = attributionResult.attributions.find(a => a.is_primary_culprit);
    try {
      await appendLedgerBlock({
        eventType: "PINN_ATTRIBUTION_TRACE",
        location: `Global Backward Trajectory from Lat 13.08, Lon 80.32`,
        summary: `DeepXDE adjoint solver matched ${selectedPolymer} plume to ${primary?.name || "Unknown"} with ${((primary?.confidence || 0) * 100).toFixed(1)}% confidence`,
        attributedParty: primary?.name || "Coastal Entity",
        severity: "CRITICAL",
        payload: { polymer: selectedPolymer, drift_hours: attributionResult.backward_pinn_hours, top_culprit: primary }
      });
      setCommitted(true);
      if (onLedgerUpdated) onLedgerUpdated();
    } catch (err) {
      console.error("Commit error:", err);
    }
  };

  const riskColor = r => ({ CRITICAL: "#f72585", HIGH: "#ffb703", MEDIUM: "#4cc9f0", LOW: "#06d6a0" }[r] || "#fff");

  const maxTons = Math.max(...filteredSources.map(s => s.annual_discharge_tons), 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", height: "calc(100vh - 120px)" }}>

      {/* ── Left: Global Source Table ─────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
          <div className="badge-glow badge-rose" style={{ marginBottom: "6px" }}>
            <Activity size={12} /> Inverse Adjoint Hydrodynamics
          </div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Global Pollution Emitter Registry</h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {sources.length} verified land-based & maritime emission sources worldwide. Combined annual discharge: <strong style={{ color: "var(--accent-amber)" }}>{(totalTons / 1000).toFixed(1)}k tons/yr</strong>.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Filter size={13} style={{ color: "var(--text-muted)" }} />
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Basin:</span>
            <select value={selectedBasin} onChange={e => setSelectedBasin(e.target.value)}
              style={{ background: "rgba(16,30,64,0.8)", color: "#e2e8f0", border: "1px solid var(--border-glass)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer", outline: "none" }}>
              {OCEAN_BASINS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Risk:</span>
            <select value={selectedRisk} onChange={e => setSelectedRisk(e.target.value)}
              style={{ background: "rgba(16,30,64,0.8)", color: "#e2e8f0", border: "1px solid var(--border-glass)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.72rem", cursor: "pointer", outline: "none" }}>
              {RISK_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginLeft: "auto" }}>
            {filteredSources.length} sources shown
          </span>
        </div>

        {/* Source Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          {filteredSources.map(src => {
            const barPct = (src.annual_discharge_tons / maxTons) * 100;
            const col = riskColor(src.risk_level);
            return (
              <div key={src.source_id} style={{
                background: "rgba(16,30,64,0.45)",
                border: `1px solid ${col}28`,
                borderLeft: `3px solid ${col}`,
                borderRadius: "var(--radius-sm)",
                padding: "12px 14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong style={{ fontSize: "0.88rem" }}>{src.name}</strong>
                      <span style={{ fontSize: "0.6rem", padding: "2px 7px", borderRadius: "9999px", background: `${col}20`, color: col, border: `1px solid ${col}50`, fontWeight: 700 }}>
                        {src.risk_level}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {src.country} • {src.type} • {src.ocean_basin}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "10px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "0.95rem", color: col }}>
                      {src.annual_discharge_tons}t
                    </div>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>/year</div>
                  </div>
                </div>

                {/* Emission bar */}
                <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${barPct}%`, background: col, borderRadius: "2px" }} />
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                  {src.primary_polymers.map(p => (
                    <span key={p} style={{ fontSize: "0.6rem", padding: "1px 6px", borderRadius: "9999px", background: "rgba(0,242,254,0.1)", color: "var(--accent-cyan)", border: "1px solid rgba(0,242,254,0.2)", fontWeight: 600 }}>{p}</span>
                  ))}
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginLeft: "auto" }}>{src.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: Attribution Solver ─────────────────────────── */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <div className="badge-glow badge-rose" style={{ marginBottom: "6px" }}>
            <TrendingDown size={12} /> Backward-in-Time PINN Solver
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Source Attribution Matrix</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Tracks observed plumes to global origin using adjoint transport.
          </p>
        </div>

        {/* Polymer selector */}
        <div>
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "7px" }}>Observed Polymer Signal:</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {["PE", "PET", "Nylon", "PVC", "PS", "ABS"].map(p => (
              <button key={p} onClick={() => { setSelectedPolymer(p); executeReverseAttribution(p); }}
                style={{ padding: "7px", borderRadius: "6px", border: selectedPolymer === p ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)", background: selectedPolymer === p ? "rgba(0,242,254,0.12)" : "rgba(255,255,255,0.03)", color: selectedPolymer === p ? "var(--accent-cyan)" : "var(--text-secondary)", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Culprit Banner */}
        {attributionResult?.attributions && (
          <div style={{ background: "linear-gradient(135deg, rgba(247,37,133,0.14), rgba(114,9,183,0.14))", border: "1px solid rgba(247,37,133,0.4)", borderRadius: "var(--radius-sm)", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.6rem", color: "var(--accent-rose)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Primary Attributed Emitter</span>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", marginTop: "2px" }}>
                {attributionResult.attributions.find(a => a.is_primary_culprit)?.name}
              </h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                {attributionResult.attributions.find(a => a.is_primary_culprit)?.country} • {attributionResult.attributions.find(a => a.is_primary_culprit)?.distance_km} km drift
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--accent-rose)", fontFamily: "var(--font-mono)" }}>
                {((attributionResult.attributions.find(a => a.is_primary_culprit)?.confidence || 0) * 100).toFixed(1)}%
              </div>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>PINN Probability</span>
            </div>
          </div>
        )}

        {/* Ranked Candidates */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
          {attributionResult?.attributions?.map(src => (
            <div key={src.source_id} style={{ background: "rgba(16,30,64,0.5)", border: src.is_primary_culprit ? "1px solid var(--accent-rose)" : "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ fontSize: "0.88rem" }}>{src.name}</strong>
                  {src.polymer_match && (
                    <span style={{ fontSize: "0.6rem", padding: "2px 7px", borderRadius: "9999px", background: "rgba(6,214,160,0.12)", color: "var(--accent-emerald)", border: "1px solid rgba(6,214,160,0.3)" }}>
                      Polymer ✓
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {src.country} • {src.distance_km} km • {src.transport_hours}h transport
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", color: src.is_primary_culprit ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                  {((src.confidence || 0) * 100).toFixed(1)}%
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Adjoint Score</span>
              </div>
            </div>
          ))}
        </div>

        {/* PINN Metadata */}
        <div style={{ background: "rgba(3,8,22,0.5)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-glass)", fontSize: "0.76rem", display: "flex", flexDirection: "column", gap: "7px" }}>
          {[
            ["Inverse Time Window", "36 Hours Adjoint"],
            ["Stokes Gravity Model", "Coupled Density Decoupling"],
            ["Attribution Standard", "UNEP Marine Plastic Audit v2"],
            ["PINN Architecture", "DeepXDE L-BFGS-B, 5k Epochs"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>{k}:</span>
              <strong style={{ textAlign: "right" }}>{v}</strong>
            </div>
          ))}
        </div>

        {/* Commit Button */}
        <button onClick={handleCommitAttribution} disabled={committed || !attributionResult} className="btn-glow-cyan"
          style={{ justifyContent: "center", background: committed ? "rgba(6,214,160,0.2)" : undefined, borderColor: committed ? "var(--accent-emerald)" : undefined, color: committed ? "var(--accent-emerald)" : undefined }}>
          {committed
            ? <><CheckCircle2 size={16} /> Attribution Sealed to Cryptographic Ledger</>
            : <><ShieldAlert size={16} /> Seal Attribution Block in Plastic Ledger</>}
        </button>
      </div>
    </div>
  );
}
