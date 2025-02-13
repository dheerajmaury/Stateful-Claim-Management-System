const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const client = require("prom-client"); // ✅ Import Prometheus client
MONGO_URI="mongodb+srv://dheerajmaurya1906:5EmDj7wR3P1iXKJs@claimsdbs.ffl66.mongodb.net/?retryWrites=true&w=majority&appName=ClaimsDBS"

dotenv.config(); // ✅ Load environment variables from .env

const app = express();

// ✅ CORS Middleware (Allow from Any Origin)
app.use(cors({
  origin: "*", // Allow all origins
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

// ✅ Prometheus Metrics Setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// API Request Counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});
register.registerMetric(httpRequestCounter);

// Middleware to track requests
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

// ✅ Metrics Route
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Claim Management System API is running...");
});

// ✅ Get MONGO_URI from .env
// const MONGO_URI = process.env.MONGO_URI;

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

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// module.exports = { app, server };
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`🚀 Server running on port ${PORT}`);
  }
});

module.exports = { app, server };
