import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { eq, and, gt, isNull } from "drizzle-orm";
import { db, usersTable, otpVerificationsTable } from "@workspace/db";

const router: IRouter = Router();

const JWT_SECRET = process.env["SESSION_SECRET"] ?? "lumora-dev-secret";
const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getAvatarInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function makeTransport() {
  const host = process.env["SMTP_HOST"] ?? "smtp.gmail.com";
  const port = Number(process.env["SMTP_PORT"] ?? "587");
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendOtpEmail(email: string, code: string, name: string): Promise<void> {
  const transport = makeTransport();
  const from = process.env["SMTP_FROM"] ?? process.env["SMTP_USER"] ?? "noreply@lumora.ai";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#161313;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#161313;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#1E1A18;border-radius:24px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
        <tr>
          <td style="padding:40px 48px 32px;text-align:center;">
            <div style="display:inline-block;background:#A78B75;border-radius:14px;padding:10px 16px;margin-bottom:24px;">
              <span style="color:#FAF7F2;font-size:18px;font-weight:600;letter-spacing:0.12em;">lumora.</span>
            </div>
            <h1 style="color:#FAF7F2;font-size:26px;font-weight:300;margin:0 0 8px;letter-spacing:-0.01em;">Verify your email</h1>
            <p style="color:#8E8178;font-size:14px;margin:0 0 32px;line-height:1.6;">
              Hi ${name}, use the code below to complete your registration.<br>
              It expires in ${OTP_EXPIRY_MINUTES} minutes.
            </p>
            <div style="background:#161313;border:1px solid rgba(167,139,117,0.25);border-radius:16px;padding:28px 40px;margin-bottom:28px;">
              <p style="color:#8E8178;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;margin:0 0 12px;">Your verification code</p>
              <p style="color:#A78B75;font-size:42px;font-weight:700;letter-spacing:0.3em;margin:0;">${code}</p>
            </div>
            <p style="color:#8E8178;font-size:12px;margin:0;line-height:1.7;">
              If you didn't request this, you can safely ignore this email.<br>
              Never share this code with anyone.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#161313;padding:20px 48px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">© 2026 Lumora AI. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  if (transport) {
    await transport.sendMail({
      from,
      to: email,
      subject: `${code} — Your Lumora AI verification code`,
      html,
    });
  } else {
    console.log(`[OTP] Email not configured. Code for ${email}: ${code}`);
  }
}

async function createAndSendOtp(email: string, name: string): Promise<void> {
  const code = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await db.delete(otpVerificationsTable).where(eq(otpVerificationsTable.email, email));
  await db.insert(otpVerificationsTable).values({ email, code, expiresAt });

  await sendOtpEmail(email, code, name);
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
  if (existingEmail.length && existingEmail[0]!.isVerified) {
    res.status(409).json({ error: "This email is already registered." });
    return;
  }

  const existingUsername = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
  if (existingUsername.length && existingUsername[0]!.isVerified) {
    res.status(409).json({ error: "This username is already taken." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (existingEmail.length) {
    await db.update(usersTable)
      .set({ name, username, passwordHash })
      .where(eq(usersTable.email, email));
  } else {
    await db.insert(usersTable).values({ name, username, email, passwordHash });
  }

  try {
    await createAndSendOtp(email, name);
  } catch (emailErr) {
    console.error("[OTP] Failed to send email:", (emailErr as Error).message);
  }

  res.status(200).json({ pending: true, email });
});

// POST /auth/verify-otp
router.post("/auth/verify-otp", async (req: Request, res: Response) => {
  const { email, code } = req.body as Record<string, string>;

  if (!email || !code) {
    res.status(400).json({ error: "Email and code are required." });
    return;
  }

  const [otp] = await db
    .select()
    .from(otpVerificationsTable)
    .where(
      and(
        eq(otpVerificationsTable.email, email),
        eq(otpVerificationsTable.code, code.trim()),
        isNull(otpVerificationsTable.usedAt),
        gt(otpVerificationsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!otp) {
    res.status(400).json({ error: "Invalid or expired verification code." });
    return;
  }

  await db.update(otpVerificationsTable)
    .set({ usedAt: new Date() })
    .where(eq(otpVerificationsTable.id, otp.id));

  const [user] = await db
    .update(usersTable)
    .set({ isVerified: true })
    .where(eq(usersTable.email, email))
    .returning();

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

  res.json({
    token,
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      avatarInitials: getAvatarInitials(user.name),
      avatarColor: user.avatarColor,
      createdAt: user.createdAt.toISOString(),
    },
  });
});

// POST /auth/resend-otp
router.post("/auth/resend-otp", async (req: Request, res: Response) => {
  const { email } = req.body as Record<string, string>;
  if (!email) {
    res.status(400).json({ error: "Email is required." });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  try {
    await createAndSendOtp(email, user.name);
  } catch (emailErr) {
    console.error("[OTP] Failed to resend email:", (emailErr as Error).message);
  }

  res.json({ ok: true });
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

  if (!user.isVerified) {
    res.status(403).json({ error: "Please verify your email before signing in.", unverified: true });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });

  res.json({
    token,
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      avatarInitials: getAvatarInitials(user.name),
      avatarColor: user.avatarColor,
      createdAt: user.createdAt.toISOString(),
    },
  });
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

    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      avatarInitials: getAvatarInitials(user.name),
      avatarColor: user.avatarColor,
      createdAt: user.createdAt.toISOString(),
    });
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

    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      plan: user.plan,
      avatarInitials: getAvatarInitials(user.name),
      avatarColor: user.avatarColor,
      createdAt: user.createdAt.toISOString(),
    });
  } catch {
    res.status(401).json({ error: "Invalid token." });
  }
});

export default router;
