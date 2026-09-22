import React, { useState, useEffect } from "react";
import { ShieldCheck, Hash, Calendar, MapPin, Download, CheckCircle2, Lock } from "lucide-react";
import { fetchLedgerRecords, fetchLedgerStats } from "../services/api";

export default function LedgerAudit() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const loadData = () => {
    Promise.all([fetchLedgerRecords(), fetchLedgerStats()])
      .then(([recData, statData]) => {
        if (recData.success) {
          setRecords(recData.records);
          if (recData.records.length > 0) {
            setSelectedBlock(recData.records[recData.records.length - 1]);
          }
        }
        if (statData.success) {
          setStats(statData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ledger load error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `plastic_ledger_audit_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "20px", height: "calc(100vh - 120px)" }}>
      {/* Blockchain Ledger Stream */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        {/* Header & Stats Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "14px" }}>
          <div>
            <div className="badge-glow badge-cyan" style={{ marginBottom: "6px" }}>
              <Lock size={12} /> SHA-256 Tamper-Evident Ledger
            </div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Cryptographic Environmental Audit Log</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Immutable chain storing satellite FDI anomalies, SegFormer detections, and PINN attributions.
            </p>
          </div>

          <button onClick={handleExportJSON} className="btn-outline" style={{ fontSize: "0.8rem" }}>
            <Download size={14} /> Export Audit JSON
          </button>
        </div>

        {/* Global Summary Cards */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            <div style={{ background: "rgba(16, 30, 64, 0.5)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Audited Plastic Volume</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--accent-cyan)" }}>{stats.total_audited_metric_tons} Tons</strong>
            </div>
            <div style={{ background: "rgba(16, 30, 64, 0.5)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Average PINN Confidence</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--accent-emerald)" }}>{stats.average_pinn_confidence}%</strong>
            </div>
            <div style={{ background: "rgba(16, 30, 64, 0.5)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Monitored Outfalls</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--accent-amber)" }}>{stats.active_monitored_sources} Facilities</strong>
            </div>
          </div>
        )}

        {/* Block List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "6px" }}>
          {records.map((block) => {
            const isSelected = selectedBlock?.index === block.index;
            return (
              <div
                key={block.index}
                onClick={() => setSelectedBlock(block)}
                style={{
                  background: isSelected ? "rgba(0, 242, 254, 0.12)" : "rgba(16, 30, 64, 0.5)",
                  border: isSelected ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 800, color: "var(--accent-cyan)", fontFamily: "JetBrains Mono" }}>
                      Block #{block.index}
                    </span>
                    <span className="badge-glow badge-cyan" style={{ fontSize: "0.65rem" }}>
                      {block.eventType}
                    </span>
                  </div>

                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--accent-emerald)" }}>
                    <CheckCircle2 size={12} /> Validated
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", marginTop: "8px", fontWeight: 500 }}>
                  {block.summary}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span>Party: <strong style={{ color: "#fff" }}>{block.attributedParty}</strong></span>
                  <span>{new Date(block.timestamp).toLocaleString()}</span>
                </div>

                {/* Hashes snippet */}
                <div style={{
                  marginTop: "8px",
                  padding: "6px 10px",
                  background: "rgba(3, 8, 22, 0.6)",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontFamily: "JetBrains Mono",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  Hash: {block.hash}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Inspector Panel */}
      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
        <div>
          <div className="badge-glow badge-emerald" style={{ marginBottom: "6px" }}>
            <Hash size={12} /> Block Cryptographic Proof
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Header & Verification</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            Cryptographic proof linkage verifying zero record tampering.
          </p>
        </div>

        {selectedBlock ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(3, 8, 22, 0.7)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-glass)", fontSize: "0.75rem", fontFamily: "JetBrains Mono" }}>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Block Index</span>
                <strong style={{ color: "var(--accent-cyan)", fontSize: "0.9rem" }}>#{selectedBlock.index}</strong>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Timestamp</span>
                <span style={{ color: "#fff" }}>{selectedBlock.timestamp}</span>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Previous Block Hash</span>
                <div style={{ color: "var(--accent-amber)", wordBreak: "break-all" }}>
                  {selectedBlock.previousHash}
                </div>
              </div>

              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Current Block SHA-256 Hash</span>
                <div style={{ color: "var(--accent-emerald)", wordBreak: "break-all" }}>
                  {selectedBlock.hash}
                </div>
              </div>
            </div>

            {/* Payload preview */}
            <div>
              <h4 style={{ fontSize: "0.85rem", color: "var(--accent-cyan)", marginBottom: "8px", textTransform: "uppercase" }}>
                Verified Evidence Payload
              </h4>
              <pre style={{
                background: "rgba(3, 8, 22, 0.7)",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                fontFamily: "JetBrains Mono",
                overflowX: "auto",
                maxHeight: "220px"
              }}>
                {JSON.stringify(selectedBlock.payload || {
                  eventType: selectedBlock.eventType,
                  summary: selectedBlock.summary,
                  attributedParty: selectedBlock.attributedParty,
                  location: selectedBlock.location,
                  severity: selectedBlock.severity
                }, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
            Select a block from the ledger stream to view cryptographic proof.
          </div>
        )}
      </div>
    </div>
  );
}
