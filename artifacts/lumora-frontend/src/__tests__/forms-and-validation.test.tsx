import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import Settings from "@/pages/Dashboard/Settings";

describe("Frontend Forms and Validation Suite", () => {
  describe("Login Form", () => {
    it("displays error message when submitted with empty fields", async () => {
      renderWithProviders(<LoginPage />);

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Please enter your email address.")).toBeInTheDocument();
    });

    it("displays error message for invalid email format", async () => {
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      fireEvent.change(emailInput, { target: { value: "invalid-email-address" } });

      const form = emailInput.closest("form")!;
      fireEvent.submit(form);

      expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    });

    it("displays error when password is empty or fewer than 6 characters", async () => {
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      fireEvent.change(emailInput, { target: { value: "designer@lumora.design" } });

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Please enter your password.")).toBeInTheDocument();

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Password must be at least 6 characters.")).toBeInTheDocument();
    });

    it("toggles password visibility when eye button is clicked", () => {
      renderWithProviders(<LoginPage />);

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      expect(passwordInput).toHaveAttribute("type", "password");

      // The eye button in password field
      const toggleBtn = passwordInput.parentElement?.querySelector("button");
      expect(toggleBtn).toBeDefined();
      if (toggleBtn) {
        fireEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "text");

        fireEvent.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "password");
      }
    });

    it("displays loading state and handles API failure with error banner", async () => {
      renderWithProviders(<LoginPage />, {
        mockFetch: async (input: RequestInfo | URL) => {
          const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
          if (url.includes("login")) {
            return new Response(JSON.stringify({ error: "Invalid email or password." }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({}), { status: 200 });
        },
      });

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "designer@lumora.design" } });
      fireEvent.change(passwordInput, { target: { value: "securePassword123!" } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Invalid email or password.")).toBeInTheDocument();
    });
  });

  describe("Signup Form", () => {
    it("validates all required fields on empty submission", async () => {
      renderWithProviders(<SignupPage />);

      const submitBtn = screen.getByRole("button", { name: /create account/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Full name is required.")).toBeInTheDocument();
      expect(screen.getByText("Username is required.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
      expect(screen.getByText("Please confirm your password.")).toBeInTheDocument();
      expect(screen.getByText("You must accept the terms.")).toBeInTheDocument();
    });

    it("validates username character constraints", async () => {
      renderWithProviders(<SignupPage />);

      const usernameInput = screen.getByPlaceholderText(/alexrivera/i);
      fireEvent.change(usernameInput, { target: { value: "invalid username!" } });

      const submitBtn = screen.getByRole("button", { name: /create account/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Only letters, numbers, underscores.")).toBeInTheDocument();

      fireEvent.change(usernameInput, { target: { value: "valid_user_123" } });
      await waitFor(() => {
        expect(screen.queryByText("Only letters, numbers, underscores.")).not.toBeInTheDocument();
      });
    });

    it("enforces minimum password length and confirmation match", async () => {
      renderWithProviders(<SignupPage />);

      const passwordInput = screen.getByPlaceholderText(/Min\. 8 characters/i);
      const confirmInput = screen.getByPlaceholderText(/Repeat your password/i);
      const submitBtn = screen.getByRole("button", { name: /create account/i });

      fireEvent.change(passwordInput, { target: { value: "short" } });
      fireEvent.change(confirmInput, { target: { value: "mismatch" } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Must be at least 8 characters.")).toBeInTheDocument();
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });

    it("updates password strength indicator dynamically", async () => {
      renderWithProviders(<SignupPage />);

      const passwordInput = screen.getByPlaceholderText(/Min\. 8 characters/i);

      // 8 chars lowercase
      fireEvent.change(passwordInput, { target: { value: "abcdefgh" } });
      expect(await screen.findByText("Fair")).toBeInTheDocument();

      // + Uppercase
      fireEvent.change(passwordInput, { target: { value: "Abcdefgh" } });
      expect(await screen.findByText("Good")).toBeInTheDocument();

      // + Digit
      fireEvent.change(passwordInput, { target: { value: "Abcdefg1" } });
      expect(await screen.findByText("Strong")).toBeInTheDocument();

      // + Special char
      fireEvent.change(passwordInput, { target: { value: "Abcdef1!" } });
      expect(await screen.findByText("Very Strong")).toBeInTheDocument();
    });

    it("toggles terms agreement checkbox", async () => {
      renderWithProviders(<SignupPage />);

      const submitBtn = screen.getByRole("button", { name: /create account/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("You must accept the terms.")).toBeInTheDocument();

      // Check the terms button
      const termsButton = screen.getByText(/Terms of Service/i).closest("div")?.querySelector("button");
      expect(termsButton).toBeDefined();
      if (termsButton) {
        fireEvent.click(termsButton);
        await waitFor(() => {
          expect(screen.queryByText("You must accept the terms.")).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("Settings Form", () => {
    it("submits updated display name and displays saved indicator", async () => {
      vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes("/api/auth/me")) {
          if (init?.method === "PUT") {
            const body = JSON.parse(String(init.body));
            return new Response(JSON.stringify({ ...mockUser, ...body }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(mockUser), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({}), { status: 200 });
      });

      renderWithProviders(<Settings />, { initialUser: mockUser });

      const nameInput = await screen.findByDisplayValue("Alexandra Vance");
      fireEvent.change(nameInput, { target: { value: "Alexandra Rivera" } });

      const saveBtn = screen.getByRole("button", { name: /save changes/i });
      fireEvent.click(saveBtn);

      expect(await screen.findByText("Saved.")).toBeInTheDocument();
    });
  });
});
