const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
  claimAmount: { type: Number, required: true },
  claimDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("Claim", ClaimSchema);
