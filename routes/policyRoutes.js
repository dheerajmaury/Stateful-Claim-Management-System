const express = require("express");
const router = express.Router();
const Policy = require("../models/Policy");

// Create Policy
router.post("/", async (req, res) => {
  try {
    const {policyNumber, policyType, coverageAmount, policyHolderEmailId, startDate, endDate } = req.body;
    const policy = new Policy({ policyNumber, policyType, coverageAmount, policyHolderEmailId, startDate, endDate });
    await policy.save();
    res.status(201).json(policy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Policies
router.get("/", async (req, res) => {
  try {
    const policies = await Policy.find();
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Policy by ID
router.get("/:id", async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate("policyholderId");
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.status(200).json(policy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Policy
router.put("/:id", async (req, res) => {
  try {
    const updatedPolicy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPolicy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Policy
router.delete("/:id", async (req, res) => {
  try {
    await Policy.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Policy deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
