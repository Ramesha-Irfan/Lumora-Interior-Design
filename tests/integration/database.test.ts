import test, { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { createIsolatedTestDb, type TestDbInstance } from "../helpers/test-db";

describe("Integration Tests: Database Operations & Persistence", () => {
  let dbInst: TestDbInstance;

  before(() => {
    dbInst = createIsolatedTestDb();
  });

  after(() => {
    dbInst.cleanup();
  });

  describe("Users Table Operations", () => {
    it("should insert a new user with hashed password and defaults", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 10);
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO users (name, username, email, password_hash, plan, avatar_color, is_verified)
        VALUES (?, ?, ?, ?, 'Free', '#A78B75', 1)
      `);
      const info = stmt.run("Alex Rivera", "alexrivera", "alex@example.com", passwordHash);
      assert.strictEqual(info.changes, 1);
      assert.ok(info.lastInsertRowid > 0);

      const user = dbInst.sqlite.prepare("SELECT * FROM users WHERE email = ?").get("alex@example.com") as {
        id: number;
        name: string;
        username: string;
        email: string;
        password_hash: string;
        plan: string;
        avatar_color: string;
        is_verified: number;
      };

      assert.ok(user);
      assert.strictEqual(user.name, "Alex Rivera");
      assert.strictEqual(user.username, "alexrivera");
      assert.strictEqual(user.plan, "Free");
      assert.strictEqual(user.avatar_color, "#A78B75");
      assert.strictEqual(user.is_verified, 1);
      const match = await bcrypt.compare("Password123!", user.password_hash);
      assert.strictEqual(match, true);
    });

    it("should enforce unique constraint on email", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 10);
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO users (name, username, email, password_hash)
        VALUES (?, ?, ?, ?)
      `);
      assert.throws(
        () => {
          // Attempt duplicate email "alex@example.com" with different username
          stmt.run("Another User", "anotheruser", "alex@example.com", passwordHash);
        },
        /UNIQUE constraint failed: users\.email/
      );
    });

    it("should enforce unique constraint on username", async () => {
      const passwordHash = await bcrypt.hash("Password123!", 10);
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO users (name, username, email, password_hash)
        VALUES (?, ?, ?, ?)
      `);
      assert.throws(
        () => {
          // Attempt duplicate username "alexrivera" with different email
          stmt.run("Duplicate Username", "alexrivera", "unique@example.com", passwordHash);
        },
        /UNIQUE constraint failed: users\.username/
      );
    });
  });

  describe("Projects, Rooms & Designs Hierarchy", () => {
    let testUserId: number;
    let testProjectId: number;
    let testRoomId: number;
    let testDesignId: number;

    before(() => {
      const u = dbInst.sqlite.prepare("SELECT id FROM users WHERE email = ?").get("alex@example.com") as { id: number };
      testUserId = u.id;
    });

    it("should enforce foreign key constraint if userId is invalid", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO projects (user_id, name) VALUES (?, ?)
      `);
      assert.throws(
        () => {
          stmt.run(999999, "Orphan Project");
        },
        /FOREIGN KEY constraint failed/
      );
    });

    it("should create project for existing user", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO projects (user_id, name) VALUES (?, ?)
      `);
      const info = stmt.run(testUserId, "Modern Penthouse Redesign");
      assert.strictEqual(info.changes, 1);
      testProjectId = Number(info.lastInsertRowid);

      const p = dbInst.sqlite.prepare("SELECT * FROM projects WHERE id = ?").get(testProjectId) as {
        id: number;
        user_id: number;
        name: string;
      };
      assert.ok(p);
      assert.strictEqual(p.name, "Modern Penthouse Redesign");
      assert.strictEqual(p.user_id, testUserId);
    });

    it("should create room attached to project", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO rooms (project_id, name, type) VALUES (?, ?, ?)
      `);
      const info = stmt.run(testProjectId, "Living Room Suite", "Living Room");
      testRoomId = Number(info.lastInsertRowid);

      const room = dbInst.sqlite.prepare("SELECT * FROM rooms WHERE id = ?").get(testRoomId) as {
        id: number;
        project_id: number;
        name: string;
        type: string;
      };
      assert.ok(room);
      assert.strictEqual(room.name, "Living Room Suite");
      assert.strictEqual(room.type, "Living Room");
      assert.strictEqual(room.project_id, testProjectId);
    });

    it("should persist design render attached to room", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO designs (room_id, image_url, prompt, style)
        VALUES (?, ?, ?, ?)
      `);
      const info = stmt.run(
        testRoomId,
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
        "Luxury modern penthouse with marble accents",
        "Luxury"
      );
      testDesignId = Number(info.lastInsertRowid);

      const design = dbInst.sqlite.prepare("SELECT * FROM designs WHERE id = ?").get(testDesignId) as {
        id: number;
        room_id: number;
        image_url: string;
        prompt: string;
        style: string;
      };
      assert.ok(design);
      assert.strictEqual(design.style, "Luxury");
      assert.strictEqual(design.room_id, testRoomId);
    });

    it("should persist favorite linking user and design", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO favorites (user_id, design_id) VALUES (?, ?)
      `);
      const info = stmt.run(testUserId, testDesignId);
      assert.strictEqual(info.changes, 1);

      const fav = dbInst.sqlite.prepare("SELECT * FROM favorites WHERE user_id = ? AND design_id = ?").get(testUserId, testDesignId) as {
        id: number;
        user_id: number;
        design_id: number;
      };
      assert.ok(fav);
      assert.strictEqual(fav.user_id, testUserId);
      assert.strictEqual(fav.design_id, testDesignId);
    });

    it("should persist user generation history", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO histories (user_id, action) VALUES (?, ?)
      `);
      const info = stmt.run(testUserId, "Generated Luxury Living Room render");
      assert.strictEqual(info.changes, 1);

      const history = dbInst.sqlite.prepare("SELECT * FROM histories WHERE user_id = ?").all(testUserId);
      assert.strictEqual(history.length, 1);
    });

    it("should store and verify OTP verification record", () => {
      const stmt = dbInst.sqlite.prepare(`
        INSERT INTO otp_verifications (user_id, code, expires_at)
        VALUES (?, ?, datetime('now', '+15 minutes'))
      `);
      const info = stmt.run(testUserId, "849201");
      assert.strictEqual(info.changes, 1);

      const record = dbInst.sqlite.prepare("SELECT * FROM otp_verifications WHERE user_id = ?").get(testUserId) as {
        code: string;
      };
      assert.strictEqual(record.code, "849201");
    });
  });
});
