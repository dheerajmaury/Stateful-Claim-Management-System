const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const Policy = require("../models/Policy");
// const authMiddleware = require("../middleware/authMiddleware");

// router.post("/", authMiddleware, async (req, res) => {
//   // Now, only authenticated users can create claims
// });


// Create Claim (Find policyId using policyNumber)
router.post("/", async (req, res) => {
  try {
    console.log("Create claim API invoked");
    const { policyNumber, claimAmount } = req.body;

    // 🔹 Step 1: Find the Policy by policyNumber
    const policy = await Policy.findOne({ policyNumber });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    // 🔹 Step 2: Validate business rule (Claim amount <= coverageAmount)
    if (claimAmount > policy.coverageAmount) {
      return res.status(400).json({ message: "Claim amount exceeds coverage amount" });
    }

    // 🔹 Step 3: Create a new Claim using policyId
    const claim = new Claim({
      policyId: policy._id,  // Use policyId from the found policy
      claimAmount
    });

    console.log("New Claim: ", claim);
    await claim.save();

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get All Claims
router.get("/", async (req, res) => {
  try {
    const claims = await Claim.find().populate("policyId");
    res.status(200).json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Claim Status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedClaim = await Claim.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updatedClaim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 

router.put("/:id", async (req, res) => {
  try {
    const {policyNumber, claimAmount, status } = req.body;

    // Check if the status is valid (Optional: Can be handled via Mongoose Schema)
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const policy = await Policy.findOne({ policyNumber });
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }
    console.log(claimAmount + " " + policy.coverageAmount);
    if (claimAmount > policy.coverageAmount) {
      return res.status(400).json({ message: "Claim amount exceeds coverage amount" });
    }

    // Find and update the claim
    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      { policyNumber, claimAmount, status },
      { new: true, runValidators: true } // Returns the updated document & applies schema validation
    );

    // If no claim found
    if (!updatedClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json(updatedClaim);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Delete a Claim by ID
router.delete("/:id", async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    res.status(200).json({ message: "Claim deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
