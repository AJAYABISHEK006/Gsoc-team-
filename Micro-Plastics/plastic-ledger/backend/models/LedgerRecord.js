const mongoose = require("mongoose");
const crypto = require("crypto");

const LedgerRecordSchema = new mongoose.Schema({
  recordIndex: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  eventType: {
    type: String,
    enum: ["SATELLITE_FDI_ALERT", "SEGFOMER_DETECTION_AUDIT", "PINN_ATTRIBUTION_TRACE", "COMPLIANCE_FINE", "SOURCE_EMISSION_LOG"],
    required: true
  },
  location: {
    lat: Number,
    lon: Number,
    regionName: String
  },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  attributedParty: { type: String, default: "Under Investigation" },
  severity: { type: String, enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"], default: "MODERATE" },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  verified: { type: Boolean, default: true }
});

LedgerRecordSchema.statics.calculateHash = function(index, prevHash, timestamp, eventType, payload) {
  const str = `${index}-${prevHash}-${timestamp.toString()}-${eventType}-${JSON.stringify(payload)}`;
  return crypto.createHash("sha256").update(str).digest("hex");
};

module.exports = mongoose.model("LedgerRecord", LedgerRecordSchema);
