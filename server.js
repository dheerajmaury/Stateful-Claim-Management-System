const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // ✅ Load environment variables from .env

const app = express();

// ✅ CORS Middleware (Updated)
app.use(cors({
  origin: ["http://localhost:3000", "https://your-vercel-frontend-url.vercel.app"], // Add your frontend URL when deployed
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

// ✅ Middleware
app.use(express.json());

// ✅ Import Routes
const policyholderRoutes = require("./routes/policyholderRoutes");
const policyRoutes = require("./routes/policyRoutes");
const claimRoutes = require("./routes/claimRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Define Routes
app.use("/api/policyholders", policyholderRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/auth", authRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Claim Management System API is running...");
});

// ✅ Get MONGO_URI from .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in the environment variables!");
  process.exit(1); // Stop the server if MONGO_URI is missing
}

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
