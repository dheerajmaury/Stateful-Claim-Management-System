const request = require("supertest");
const { app, server } = require("../server"); // Import the app and server
const { default: mongoose } = require("mongoose");

describe("Backend-Test", () => {
  afterAll(async () => {
    await mongoose.connection.close(); // ✅ Closes MongoDB connection
    server.close(); // ✅ Ensures server shuts down after tests
  });

  describe("Claim API Tests", () => {
    it("should create a claim", async () => {
      const response = await request(app).post("/api/claims").send({
        policyNumber: "POL12345",
        claimAmount: 5000,
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("_id");
    });

    it("should fetch all claims", async () => {
      const response = await request(app).get("/api/claims");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
    });

    it("should return 404 if policy not found", async () => {
      const response = await request(app).post("/api/claims").send({
        policyNumber: "999", // Non-existent policy
        claimAmount: 5000,
      });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Policy not found");
    });
  });
});
