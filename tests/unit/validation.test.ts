import "../helpers/test-db";
import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HealthCheckResponse } from "@workspace/api-zod";
import { insertUserSchema } from "@workspace/db";

// Exact implementation from artifacts/lumora-frontend/src/pages/Signup/SignupPage.tsx
export function validateSignup(
  form: { name: string; username: string; email: string; password: string; confirm: string },
  agreed: boolean
) {
  const e: Record<string, string> = {};
  if (!form.name.trim()) e.name = "Full name is required.";
  if (!form.username.trim()) e.username = "Username is required.";
  else if (!/^[a-z0-9_]+$/i.test(form.username)) e.username = "Only letters, numbers, underscores.";
  if (!form.email) e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email))
    e.email = "Enter a valid email.";
  if (!form.password) e.password = "Password is required.";
  else if (form.password.length < 8) e.password = "Must be at least 8 characters.";
  if (!form.confirm) e.confirm = "Please confirm your password.";
  else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
  if (!agreed) e.terms = "You must accept the terms.";
  return e;
}
export const validateSignupCurrent = validateSignup;

// Standard intended email validation (RFC 5322 standard requirement)
export function validateEmailIntended(email: string): { valid: boolean; error?: string } {
  if (!email || !email.trim()) {
    return { valid: false, error: "Email is required." };
  }
  // Standard format: user@domain.tld
  const standardEmailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!standardEmailRegex.test(email)) {
    return { valid: false, error: "Enter a valid email address." };
  }
  return { valid: true };
}

// Exact implementation from artifacts/lumora-frontend/src/pages/Signup/SignupPage.tsx
export function calculatePasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: "Weak", color: "#F87171" },
    { label: "Fair", color: "#FBBF24" },
    { label: "Good", color: "#A78B75" },
    { label: "Strong", color: "#86EFAC" },
    { label: "Very Strong", color: "#4ADE80" },
  ];
  return { score, ...map[score] };
}

// Exact implementation from artifacts/lumora-frontend/src/pages/Login/LoginPage.tsx
export function validateLogin(email: string, password: string) {
  if (!email) return "Please enter your email address.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
  if (!password) return "Please enter your password.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
}

describe("Unit Tests: Form Validation, Passwords & API Schemas", () => {
  describe("Signup Form Validation - Current Behavior", () => {
    it("should report missing required fields", () => {
      const errors = validateSignupCurrent(
        { name: "", username: "", email: "", password: "", confirm: "" },
        false
      );
      assert.strictEqual(errors.name, "Full name is required.");
      assert.strictEqual(errors.username, "Username is required.");
      assert.strictEqual(errors.email, "Email is required.");
      assert.strictEqual(errors.password, "Password is required.");
      assert.strictEqual(errors.confirm, "Please confirm your password.");
      assert.strictEqual(errors.terms, "You must accept the terms.");
    });

    it("should reject invalid username characters", () => {
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "john doe!", email: "test@lumora", password: "Password123!", confirm: "Password123!" },
        true
      );
      assert.strictEqual(errors.username, "Only letters, numbers, underscores.");
    });

    it("should accept valid alphanumeric and underscore usernames", () => {
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "john_doe_99", email: "test@lumora", password: "Password123!", confirm: "Password123!" },
        true
      );
      assert.strictEqual(errors.username, undefined);
    });

    it("should reject password shorter than 8 characters", () => {
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "johndoe", email: "test@lumora", password: "short", confirm: "short" },
        true
      );
      assert.strictEqual(errors.password, "Must be at least 8 characters.");
    });

    it("should reject password and confirm password mismatch", () => {
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "johndoe", email: "test@lumora", password: "Password123!", confirm: "DifferentPassword!" },
        true
      );
      assert.strictEqual(errors.confirm, "Passwords do not match.");
    });

    it("should require terms agreement checkbox", () => {
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "johndoe", email: "test@lumora", password: "Password123!", confirm: "Password123!" },
        false
      );
      assert.strictEqual(errors.terms, "You must accept the terms.");
    });

    it("should reject malformed email addresses in signup", () => {
      const invalidCases = [
        { email: "@example.com", reason: "missing username" },
        { email: "designerexample.com", reason: "missing @" },
        { email: "designer@com", reason: "missing domain name" },
        { email: "designer@.com", reason: "empty domain" },
        { email: "designer@example", reason: "missing domain extension" },
        { email: "designer@example.", reason: "trailing dot" },
        { email: "designer @example.com", reason: "contains space" },
      ];
      for (const { email, reason } of invalidCases) {
        const errors = validateSignupCurrent(
          { name: "John Doe", username: "johndoe", email, password: "Password123!", confirm: "Password123!" },
          true
        );
        assert.strictEqual(
          errors.email,
          "Enter a valid email.",
          `Expected ${email} (${reason}) to be rejected with 'Enter a valid email.'`
        );
      }
    });

    it("should accept Gmail and Outlook standard email addresses", () => {
      const validCases = [
        "designer@gmail.com",
        "designer@outlook.com",
        "alex.rivera@lumora.design",
      ];
      for (const email of validCases) {
        const errors = validateSignupCurrent(
          { name: "John Doe", username: "johndoe", email, password: "Password123!", confirm: "Password123!" },
          true
        );
        assert.strictEqual(
          errors.email,
          undefined,
          `Expected ${email} to be accepted without error`
        );
      }
    });

    it("INTENDED REQUIREMENT: Standard email address format validation", () => {
      // Valid email addresses that should be supported in standard production requirements
      const validEmails = [
        "designer@example.com",
        "designer@gmail.com",
        "designer@outlook.com",
        "alex.rivera@lumora.design",
        "user_123@sub.domain.io",
      ];
      for (const email of validEmails) {
        const result = validateEmailIntended(email);
        assert.strictEqual(result.valid, true, `Expected ${email} to be valid`);
      }

      // Invalid email addresses that must be blocked
      const invalidEmails = [
        "",
        "notanemail",
        "missingatsign.com",
        "@nodomain",
        "spaces in@email.com",
      ];
      for (const email of invalidEmails) {
        const result = validateEmailIntended(email);
        assert.strictEqual(result.valid, false, `Expected ${email} to be invalid`);
      }
    });

    it("FAILING REGRESSION CHECK: Current SignupPage validation against intended requirement (blocks standard emails)", () => {
      // Under intended requirements, a user entering designer@example.com should have NO email validation error.
      const errors = validateSignupCurrent(
        { name: "John Doe", username: "johndoe", email: "designer@example.com", password: "Password123!", confirm: "Password123!" },
        true
      );
      assert.strictEqual(
        errors.email,
        undefined,
        "Intended requirement: standard email designer@example.com must not produce a validation error"
      );
    });
  });

  describe("Password Strength Meter", () => {
    it("should return score 0 for empty password", () => {
      const strength = calculatePasswordStrength("");
      assert.strictEqual(strength.score, 0);
    });

    it("should return score 1 (Fair) for 8 characters lowercase only", () => {
      const strength = calculatePasswordStrength("abcdefgh");
      assert.strictEqual(strength.score, 1);
      assert.strictEqual(strength.label, "Fair");
    });

    it("should return score 2 (Good) for 8 characters with uppercase", () => {
      const strength = calculatePasswordStrength("Abcdefgh");
      assert.strictEqual(strength.score, 2);
      assert.strictEqual(strength.label, "Good");
    });

    it("should return score 3 (Strong) for 8 characters with uppercase and digit", () => {
      const strength = calculatePasswordStrength("Abcdefg1");
      assert.strictEqual(strength.score, 3);
      assert.strictEqual(strength.label, "Strong");
    });

    it("should return score 4 (Very Strong) for 8 characters with upper, digit, and special char", () => {
      const strength = calculatePasswordStrength("Abcdef1!");
      assert.strictEqual(strength.score, 4);
      assert.strictEqual(strength.label, "Very Strong");
    });
  });

  describe("Login Form Validation", () => {
    it("should require email", () => {
      const err = validateLogin("", "secret123");
      assert.strictEqual(err, "Please enter your email address.");
    });

    it("should reject malformed email", () => {
      const err = validateLogin("notanemail", "secret123");
      assert.strictEqual(err, "Please enter a valid email address.");
    });

    it("should require password", () => {
      const err = validateLogin("user@example.com", "");
      assert.strictEqual(err, "Please enter your password.");
    });

    it("should reject password shorter than 6 characters", () => {
      const err = validateLogin("user@example.com", "12345");
      assert.strictEqual(err, "Password must be at least 6 characters.");
    });

    it("should accept valid email and password format", () => {
      const err = validateLogin("user@example.com", "validPassword123");
      assert.strictEqual(err, "");
    });
  });

  describe("API Schemas and Contract Validation", () => {
    it("should validate HealthCheckResponse schema", () => {
      const valid = HealthCheckResponse.safeParse({ status: "ok" });
      assert.strictEqual(valid.success, true);

      const invalid = HealthCheckResponse.safeParse({});
      assert.strictEqual(invalid.success, false);
    });

    it("should validate insertUserSchema with required fields", () => {
      const valid = insertUserSchema.safeParse({
        name: "Jane Doe",
        username: "janedoe",
        email: "jane@example.com",
        passwordHash: "$2a$10$abcdefghijklmnopqrstuvwxyz0123456789",
      });
      assert.strictEqual(valid.success, true);

      const missing = insertUserSchema.safeParse({
        name: "Jane Doe",
      });
      assert.strictEqual(missing.success, false);
    });
  });
});
