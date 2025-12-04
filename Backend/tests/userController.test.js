import request from "supertest";
import app from "../server.js";

describe("User Controller - Critical Path", () => {
  let token = "";

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/user/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        nim: "12345678"
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("email", "testuser@example.com");
  });

  it("should login registered user and get token", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "testuser@example.com",
        password: "password123"
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data).toHaveProperty("email", "testuser@example.com");
    expect(response.body).toHaveProperty("token");
    token = response.body.token;
  });

  it("should fail login with wrong password", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "testuser@example.com",
        password: "wrongpassword"
      });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  // More critical path tests can be added here for user controller
});
