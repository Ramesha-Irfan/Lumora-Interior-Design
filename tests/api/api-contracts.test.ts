import test, { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { type AddressInfo } from "node:net";
import { createIsolatedTestDb, type TestDbInstance } from "../helpers/test-db";

let testDb: TestDbInstance;
let server: http.Server;
let baseUrl: string;

describe("API Contract & Integration Tests: Express Endpoints", () => {
  before(async () => {
    // 1. Create an isolated database specifically for API tests
    testDb = createIsolatedTestDb();
    process.env.DATABASE_URL = `file:${testDb.dbPath}`;
    process.env.SESSION_SECRET = "test-jwt-secret-key-123456";

    // 2. Import app dynamically after setting environment variable
    const { default: app } = await import("../../artifacts/api-server/src/app");

    // 3. Start server on an ephemeral free port
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const port = (server.address() as AddressInfo).port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });
    if (testDb) {
      testDb.cleanup();
    }
  });

  describe("GET /api/healthz", () => {
    it("should return status 200 and health status 'ok'", async () => {
      const res = await fetch(`${baseUrl}/api/healthz`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers.get("content-type")?.includes("application/json"));
      const body = (await res.json()) as { status: string };
      assert.strictEqual(body.status, "ok");
    });
  });

  describe("POST /api/auth/register", () => {
    it("should reject registration with missing fields with status 400", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alex" }),
      });
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "All fields are required.");
    });

    it("should reject invalid username with spaces or special characters with status 400", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Invalid User",
          username: "user name with spaces",
          email: "user1@example.com",
          password: "Password123!",
        }),
      });
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Username may only contain letters, numbers, and underscores.");
    });

    it("should reject passwords shorter than 8 characters with status 400", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Short Pass",
          username: "shortpass",
          email: "short@example.com",
          password: "short",
        }),
      });
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Password must be at least 8 characters.");
    });

    it("should successfully register a valid user with status 201 and JWT token", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Elena Rostova",
          username: "elena_design",
          email: "elena@lumora.design",
          password: "SecurePassword123!",
        }),
      });
      assert.strictEqual(res.status, 201);
      const data = (await res.json()) as {
        token: string;
        user: {
          name: string;
          username: string;
          email: string;
          plan: string;
          avatarInitials: string;
          avatarColor: string;
          createdAt: string;
        };
      };
      assert.ok(typeof data.token === "string" && data.token.length > 20);
      assert.strictEqual(data.user.name, "Elena Rostova");
      assert.strictEqual(data.user.username, "elena_design");
      assert.strictEqual(data.user.email, "elena@lumora.design");
      assert.strictEqual(data.user.plan, "Free");
      assert.strictEqual(data.user.avatarInitials, "ER");
    });

    it("should reject duplicate email registration with status 409", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Elena Clone",
          username: "elena_clone",
          email: "elena@lumora.design", // Duplicate email
          password: "SecurePassword123!",
        }),
      });
      assert.strictEqual(res.status, 409);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "This email is already registered.");
    });

    it("should reject duplicate username registration with status 409", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Another Elena",
          username: "elena_design", // Duplicate username
          email: "different_email@lumora.design",
          password: "SecurePassword123!",
        }),
      });
      assert.strictEqual(res.status, 409);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "This username is already taken.");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should reject missing credentials with status 400", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "" }),
      });
      assert.strictEqual(res.status, 400);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Email and password are required.");
    });

    it("should reject incorrect password with status 401", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "elena@lumora.design",
          password: "WrongPassword999!",
        }),
      });
      assert.strictEqual(res.status, 401);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Invalid email or password.");
    });

    it("should reject non-existent user with status 401", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nonexistent@lumora.design",
          password: "SecurePassword123!",
        }),
      });
      assert.strictEqual(res.status, 401);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Invalid email or password.");
    });

    it("should successfully log in with status 200 and return token and profile", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "elena@lumora.design",
          password: "SecurePassword123!",
        }),
      });
      assert.strictEqual(res.status, 200);
      const data = (await res.json()) as {
        token: string;
        user: { name: string; username: string; email: string };
      };
      assert.ok(typeof data.token === "string" && data.token.length > 20);
      assert.strictEqual(data.user.email, "elena@lumora.design");
      assert.strictEqual(data.user.username, "elena_design");
    });
  });

  describe("Authorization & User Profile: GET / PUT /api/auth/me", () => {
    let validToken: string;

    before(async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "elena@lumora.design",
          password: "SecurePassword123!",
        }),
      });
      const data = (await res.json()) as { token: string };
      validToken = data.token;
    });

    it("GET /api/auth/me without Bearer header should return status 401 Unauthorized", async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`);
      assert.strictEqual(res.status, 401);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Unauthorized.");
    });

    it("GET /api/auth/me with invalid token should return status 401", async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: "Bearer forged.invalid.token" },
      });
      assert.strictEqual(res.status, 401);
      const data = (await res.json()) as { error: string };
      assert.strictEqual(data.error, "Invalid token.");
    });

    it("GET /api/auth/me with valid Bearer token should return status 200 and profile", async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      assert.strictEqual(res.status, 200);
      const user = (await res.json()) as {
        name: string;
        username: string;
        email: string;
        plan: string;
      };
      assert.strictEqual(user.name, "Elena Rostova");
      assert.strictEqual(user.email, "elena@lumora.design");
    });

    it("PUT /api/auth/me should update profile for authenticated user", async () => {
      const res = await fetch(`${baseUrl}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({
          name: "Elena Rostova Updated",
          username: "elena_updated",
        }),
      });
      assert.strictEqual(res.status, 200);
      const updated = (await res.json()) as { name: string; username: string };
      assert.strictEqual(updated.name, "Elena Rostova Updated");
      assert.strictEqual(updated.username, "elena_updated");
    });
  });
});
