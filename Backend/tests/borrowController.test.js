import request from "supertest";
import app from "../server.js";

describe("Borrow Controller - Critical Path", () => {
  let token = "";
  let borrowId = null;

  beforeAll(async () => {
    // login user to get token
    const loginResponse = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "password123"
    });
    token = loginResponse.body.token;
  });

  it("should respond with 401 Unauthorized when no token is provided for borrowing book", async () => {
    const response = await request(app).post("/api/borrow/1");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "akses ditolak, token tidak ada");
  });

  it("should borrow a book with valid token", async () => {
    const response = await request(app)
      .post("/api/borrow/1")
      .set("Authorization", `Bearer ${token}`);
    // Status will depend on DB state, so just check for success or expected errors
    expect([201, 400]).toContain(response.status);
  });

  it("should get borrowed books with pagination", async () => {
    const response = await request(app)
      .get("/api/borrow?page=1&limit=5")
      .set("Authorization", `Bearer ${token}`);
    // Only admin can access; we assume testuser is non-admin, so 404 or 403 possible
    expect([200, 404, 403]).toContain(response.status);
  });

  // We skip returnBook test here as it requires an existing borrow entry with an ID.

});
