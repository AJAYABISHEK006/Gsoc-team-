const mongoose = require("mongoose");

const PollutionSourceSchema = new mongoose.Schema({
  sourceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["River Discharge", "Urban Wastewater", "Port / Maritime", "Commercial Shipping", "Industrial Effluent"] },
  location: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  estimatedAnnualDischargeTons: { type: Number, default: 120 },
  typicalPolymers: [{ type: String }],
  riskSeverity: { type: String, enum: ["HIGH", "MEDIUM", "CRITICAL", "LOW"], default: "MEDIUM" },
  activeSurveillance: { type: Boolean, default: true }
});

module.exports = mongoose.model("PollutionSource", PollutionSourceSchema);
