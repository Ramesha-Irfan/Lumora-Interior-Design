import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

const JWT_SECRET = process.env["SESSION_SECRET"] ?? "lumora-dev-secret";

function getAvatarInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function makeUserResponse(user: typeof usersTable.$inferSelect) {
  const createdAt =
    typeof user.createdAt === "string"
      ? user.createdAt
      : (user.createdAt as Date).toISOString();
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    plan: user.plan,
    avatarInitials: getAvatarInitials(user.name),
    avatarColor: user.avatarColor,
    createdAt,
  };
}

// POST /auth/register
router.post("/auth/register", async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body as Record<string, string>;

  if (!name || !username || !email || !password) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  if (!/^[a-z0-9_]+$/i.test(username)) {
    res.status(400).json({ error: "Username may only contain letters, numbers, and underscores." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const existingEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existingEmail.length) {
    res.status(409).json({ error: "This email is already registered." });
    return;
  }

  const existingUsername = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (existingUsername.length) {
    res.status(409).json({ error: "This username is already taken." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({ name, username, email, passwordHash, isVerified: true })
    .returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create account." });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

  res.status(201).json({ token, user: makeUserResponse(user) });
});

// POST /auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as Record<string, string>;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

  res.json({ token, user: makeUserResponse(user) });
});

// GET /auth/me
router.get("/auth/me", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).limit(1);

    if (!user) {
      res.status(401).json({ error: "User not found." });
      return;
    }

    res.json(makeUserResponse(user));
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
});

// PUT /auth/me
router.put("/auth/me", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number };
    const updates = req.body as Partial<{ name: string; username: string }>;

    const [user] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, payload.userId))
      .returning();

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json(makeUserResponse(user));
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
});

export default router;
