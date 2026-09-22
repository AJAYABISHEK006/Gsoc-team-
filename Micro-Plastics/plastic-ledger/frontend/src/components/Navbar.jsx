import React from "react";
import { Satellite, Waves, ShieldCheck, Microscope, Compass, Database, Activity } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, healthData }) {
  const navItems = [
    { id: "map", label: "Ocean GIS Map", icon: Compass },
    { id: "vision", label: "SegFormer Sub-Pixel Vision", icon: Microscope },
    { id: "pinn", label: "DeepXDE Physics-AI", icon: Waves },
    { id: "satellite", label: "Sentinel & Landsat Remote Sensing", icon: Satellite },
    { id: "attribution", label: "Source Attribution", icon: Activity },
    { id: "ledger", label: "Cryptographic Ledger", icon: ShieldCheck },
  ];

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 28px",
      borderBottom: "1px solid var(--border-glass)",
      background: "rgba(7, 13, 30, 0.85)",
      backdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #00f2fe, #4facfe)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 20px rgba(0, 242, 254, 0.4)"
        }}>
          <Waves size={24} color="#030816" strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              PLASTIC<span style={{ color: "var(--accent-cyan)" }}>LEDGER</span>
            </h1>
            <span className="badge-glow badge-cyan" style={{ fontSize: "0.65rem" }}>MERN • PINN • GIS</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Copernicus Sentinel-2 • Landsat-9 • SegFormer Sub-Pixel • DeepXDE Advection
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                border: isActive ? "1px solid var(--accent-cyan)" : "1px solid transparent",
                background: isActive ? "rgba(0, 242, 254, 0.12)" : "transparent",
                color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={16} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Health status pill */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          background: "rgba(16, 30, 64, 0.7)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "9999px",
          fontSize: "0.75rem"
        }}>
          <span className="pulse-dot" />
          <span style={{ color: "var(--text-secondary)" }}>
            Engine: <strong style={{ color: "#fff" }}>{healthData?.database?.database || "Ready"}</strong>
          </span>
          <span style={{ color: "var(--border-subtle)" }}>|</span>
          <span style={{ color: "var(--accent-emerald)" }}>Sentinel-2 & Landsat Live</span>
        </div>
      </div>
    </header>
  );
}
