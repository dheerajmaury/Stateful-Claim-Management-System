const express = require("express");
const router = express.Router();
const Policyholder = require("../models/Policyholder");

// Create Policyholder
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const policyholder = new Policyholder({ name, email, phone, address });
    await policyholder.save();
    res.status(201).json(policyholder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getAllPolicyHolders", async (req, res) => {
  try {
    console.log("GET /getAllPolicyHolders API hit"); // Debugging
    const policyholders = await Policyholder.find();
    console.log("Fetched Policyholders:", policyholders); // Debugging
    res.status(200).json(policyholders);
  } catch (err) {
    console.error("Error fetching policyholders:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update Policyholder by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const updatedPolicyholder = await Policyholder.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedPolicyholder) {
      return res.status(404).json({ message: "Policyholder not found" });
    }

    res.status(200).json(updatedPolicyholder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});





module.exports = router;
