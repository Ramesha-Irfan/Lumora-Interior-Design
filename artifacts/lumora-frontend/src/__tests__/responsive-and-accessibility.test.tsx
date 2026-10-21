import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import Settings from "@/pages/Dashboard/Settings";
import Projects from "@/pages/Dashboard/Projects";
import GalleryPage from "@/pages/Gallery/GalleryPage";
import StudioPage from "@/pages/Studio/StudioPage";
import Navbar from "@/components/common/Navbar";
import DashboardLayout from "@/components/layout/DashboardLayout";

describe("Frontend Responsive and Accessibility Suite", () => {
  describe("Accessibility (a11y)", () => {
    it("ensures all input controls on Login page have visible labels and proper autocomplete", () => {
      renderWithProviders(<LoginPage />);

      expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByText(/^Password$/i)).toBeInTheDocument();

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("autoComplete", "email");

      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      expect(passwordInput).toHaveAttribute("autoComplete", "current-password");
    });

    it("ensures all input controls on Signup page have descriptive labels and autocomplete attributes", () => {
      renderWithProviders(<SignupPage />);

      expect(screen.getByText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByText(/^Username$/i)).toBeInTheDocument();
      expect(screen.getByText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByText(/^Password$/i)).toBeInTheDocument();
      expect(screen.getByText(/Confirm Password/i)).toBeInTheDocument();

      expect(screen.getByPlaceholderText(/Alex Rivera/i)).toHaveAttribute("autoComplete", "name");
      expect(screen.getByPlaceholderText(/alexrivera/i)).toHaveAttribute("autoComplete", "username");
      expect(screen.getByPlaceholderText(/you@example\.com/i)).toHaveAttribute("autoComplete", "email");
      expect(screen.getByPlaceholderText(/Min\. 8 characters/i)).toHaveAttribute("autoComplete", "new-password");
      expect(screen.getByPlaceholderText(/Repeat your password/i)).toHaveAttribute("autoComplete", "new-password");
    });

    it("ensures image elements on marketing and studio pages include non-empty alt text", () => {
      renderWithProviders(<HomePage />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);
      for (const img of images) {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      }
    });

    it("ensures form elements are focusable and keyboard accessible", () => {
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      emailInput.focus();
      expect(document.activeElement).toBe(emailInput);

      submitBtn.focus();
      expect(document.activeElement).toBe(submitBtn);
    });

    it("ensures Settings inputs have proper accessible labels and email is explicitly read-only", async () => {
      renderWithProviders(<Settings />, { initialUser: mockUser });

      expect(await screen.findByDisplayValue("Alexandra Vance")).toBeInTheDocument();
      expect(screen.getByText(/Display name/i)).toBeInTheDocument();
      expect(screen.getByText(/Username/i)).toBeInTheDocument();
      expect(screen.getByText(/Email/i)).toBeInTheDocument();

      const emailInput = screen.getByDisplayValue("alexandra@lumora.design");
      expect(emailInput).toHaveAttribute("readOnly");
    });
  });

  describe("Responsive Layouts", () => {
    it("renders Navbar with responsive layout hooks for desktop and mobile navigation", () => {
      const { container } = renderWithProviders(<Navbar />);

      // Desktop links container has md:flex hidden
      const desktopNav = container.querySelector(".hidden.md\\:flex");
      expect(desktopNav).toBeInTheDocument();

      // Mobile hamburger button has md:hidden
      const mobileBtn = container.querySelector(".md\\:hidden");
      expect(mobileBtn).toBeInTheDocument();
    });

    it("renders Gallery category filters and grid container with responsive classes", () => {
      const { container } = renderWithProviders(<GalleryPage />);

      const flexContainer = container.querySelector(".flex.flex-wrap.justify-center");
      expect(flexContainer).toBeInTheDocument();
    });

    it("renders Studio page with responsive two-column grid layout", () => {
      const { container } = renderWithProviders(<StudioPage />);

      const gridContainer = container.querySelector(".grid.lg\\:grid-cols-2");
      expect(gridContainer).toBeInTheDocument();
    });

    it("renders Dashboard Projects with responsive grid layout classes", () => {
      const { container } = renderWithProviders(<Projects />, { initialUser: mockUser });

      const grid = container.querySelector(".grid.grid-cols-1.md\\:grid-cols-2");
      expect(grid).toBeInTheDocument();
    });

    it("renders Dashboard sidebar with responsive hidden-on-mobile and fixed desktop classes", () => {
      const { container } = renderWithProviders(
        <DashboardLayout>
          <div>Child</div>
        </DashboardLayout>,
        { initialUser: mockUser }
      );

      const sidebar = container.querySelector("aside.hidden.lg\\:flex");
      expect(sidebar).toBeInTheDocument();
    });
  });
});
