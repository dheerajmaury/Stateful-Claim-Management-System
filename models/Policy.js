const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema({
  // policyholderId: { type: mongoose.Schema.Types.ObjectId, ref: "Policyholder" },
  policyNumber: { type: String, required: true, unique: true },
  policyType: {type: String, requried: true},
  coverageAmount: { type: Number, required: true },
  policyHolderEmailId: {type: String, required: true, unique: true},
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("Policy", PolicySchema);
