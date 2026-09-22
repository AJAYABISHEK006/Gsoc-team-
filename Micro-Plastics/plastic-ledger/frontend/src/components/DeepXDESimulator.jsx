import React, { useState, useEffect } from "react";
import { Waves, Play, Sliders, Activity, Info, CheckCircle2 } from "lucide-react";
import { runPINNSimulation } from "../services/api";

export default function DeepXDESimulator({ selectedHotspot }) {
  const [polymer, setPolymer] = useState(selectedHotspot?.polymer || "PE");
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [selectedTimestep, setSelectedTimestep] = useState(24);

  const executeSimulation = async () => {
    setLoading(true);
    try {
      const res = await runPINNSimulation(polymer, 12.92, 80.25);
      if (res.success || res.physics_model) {
        setSimResult(res.data || res);
      }
    } catch (err) {
      console.error("PINN simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSimulation();
  }, [polymer]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Parameter Control Panel */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <div className="badge-glow badge-cyan" style={{ marginBottom: "6px" }}>
            <Waves size={12} /> Physics-Informed Neural Network
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>DeepXDE Transport PDE</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Advection-Diffusion-Settling hydrodynamic neural solver.
          </p>
        </div>

        {/* Governing PDE Formula Card */}
        <div style={{
          background: "rgba(3, 8, 22, 0.7)",
          padding: "14px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-glass)",
          fontFamily: "JetBrains Mono",
          fontSize: "0.8rem",
          color: "var(--accent-cyan)"
        }}>
          ∂C/∂t + u·∇C = K_h·∇²C - w_s·(∂C/∂z) + S
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px", fontFamily: "Inter" }}>
            C: Concentration • u: Current Velocity • K_h: Eddy Diffusivity • w_s: Stokes Settling
          </div>
        </div>

        {/* Polymer Selection */}
        <div>
          <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
            Target Marine Polymer:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {["PE", "PS", "ABS", "Nylon", "PET", "PVC"].map((p) => (
              <button
                key={p}
                onClick={() => setPolymer(p)}
                style={{
                  padding: "8px",
                  borderRadius: "var(--radius-sm)",
                  border: polymer === p ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  background: polymer === p ? "rgba(0, 242, 254, 0.15)" : "rgba(255, 255, 255, 0.03)",
                  color: polymer === p ? "var(--accent-cyan)" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Polymer Hydrodynamic Traits */}
        {simResult && (
          <div style={{ background: "rgba(16, 30, 64, 0.5)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", fontSize: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Density:</span>
              <strong>{simResult.density_g_cm3} g/cm³</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Stokes Velocity (w_s):</span>
              <strong style={{ color: "var(--accent-emerald)", fontFamily: "JetBrains Mono" }}>
                {simResult.stokes_velocity_m_s} m/s
              </strong>
            </div>
            <div style={{ color: "var(--accent-amber)", fontSize: "0.75rem", marginTop: "4px" }}>
              Regime: {simResult.buoyancy_regime}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={executeSimulation}
          disabled={loading}
          className="btn-glow-cyan"
          style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
        >
          <Play size={14} /> {loading ? "Solving PINN Loss..." : "Recompute PINN Trajectory"}
        </button>
      </div>

      {/* Trajectory & Plume Visualization View */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Header with Convergence Metrics */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Advection-Diffusion Plume Dispersion</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              DeepXDE L-BFGS-B Optimization • 5,000 Epochs • Physics Residual Loss
            </p>
          </div>

          {simResult?.pinn_convergence && (
            <div style={{ display: "flex", gap: "12px" }}>
              <div className="badge-glow badge-emerald">
                PDE Loss: {simResult.pinn_convergence.pde_residual_loss?.toExponential(2)}
              </div>
              <div className="badge-glow badge-cyan">
                Data Loss: {simResult.pinn_convergence.data_loss?.toExponential(2)}
              </div>
            </div>
          )}
        </div>

        {/* Trajectory Timestep Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
          {simResult?.trajectory?.map((step) => {
            const isSel = selectedTimestep === step.time_hours;
            return (
              <div
                key={step.time_hours}
                onClick={() => setSelectedTimestep(step.time_hours)}
                style={{
                  background: isSel ? "rgba(0, 242, 254, 0.15)" : "rgba(255, 255, 255, 0.02)",
                  border: isSel ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ fontSize: "0.75rem", color: isSel ? "var(--accent-cyan)" : "var(--text-muted)", fontWeight: 600 }}>
                  T + {step.time_hours} Hours
                </div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
                  {step.dispersion_radius_meters} m
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Radius of Plume
                </div>
              </div>
            );
          })}
        </div>

        {/* Trajectory Coordinates Table */}
        <div style={{
          flex: 1,
          background: "rgba(3, 8, 22, 0.6)",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-glass)",
          overflowY: "auto",
          padding: "16px"
        }}>
          <h4 style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", marginBottom: "12px", textTransform: "uppercase" }}>
            Simulated Lagrangian Drift Coordinates
          </h4>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textAlign: "left" }}>
                <th style={{ padding: "8px" }}>Time (hrs)</th>
                <th style={{ padding: "8px" }}>Latitude</th>
                <th style={{ padding: "8px" }}>Longitude</th>
                <th style={{ padding: "8px" }}>Peak Conc. (pts/m³)</th>
                <th style={{ padding: "8px" }}>Dispersion (m)</th>
              </tr>
            </thead>
            <tbody>
              {simResult?.trajectory?.map((pt) => (
                <tr key={pt.time_hours} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>T + {pt.time_hours}h</td>
                  <td style={{ padding: "10px 8px", fontFamily: "JetBrains Mono" }}>{pt.lat}</td>
                  <td style={{ padding: "10px 8px", fontFamily: "JetBrains Mono" }}>{pt.lon}</td>
                  <td style={{ padding: "10px 8px", color: "var(--accent-emerald)" }}>{pt.peak_concentration_particles_m3}</td>
                  <td style={{ padding: "10px 8px" }}>{pt.dispersion_radius_meters} m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
