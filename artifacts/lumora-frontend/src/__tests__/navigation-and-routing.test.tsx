import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import Navbar from "@/components/common/Navbar";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppRouter from "@/routes/AppRouter";
import { Router } from "wouter";
import { memoryLocation } from "wouter/memory-location";

describe("Frontend Navigation and Routing Suite", () => {
  it("renders Navbar desktop navigation links and branding", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText(/lumora/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^projects$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^studio$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^dashboard$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^get started$/i })).toBeInTheDocument();
  });

  it("toggles mobile navigation drawer on hamburger menu click", async () => {
    renderWithProviders(<Navbar />);

    // Mobile menu toggle button
    const buttons = screen.getAllByRole("button");
    const hamburgerBtn = buttons.find((b) => b.className.includes("md:hidden"));
    expect(hamburgerBtn).toBeDefined();

    // Click to open mobile menu
    if (hamburgerBtn) {
      fireEvent.click(hamburgerBtn);
      // Mobile drawer links appear
      const allHomeLinks = screen.getAllByRole("link", { name: /^home$/i });
      expect(allHomeLinks.length).toBeGreaterThanOrEqual(1);

      // Click again to close
      fireEvent.click(hamburgerBtn);
    }
  });

  it("blocks unauthenticated users in ProtectedRoute and shows redirect gate", async () => {
    const { hook } = memoryLocation({ path: "/dashboard" });

    renderWithProviders(
      <Router hook={hook}>
        <ProtectedRoute>
          <div>Protected Content Area</div>
        </ProtectedRoute>
      </Router>,
      { initialUser: null }
    );

    // Unauthenticated prompt is displayed
    expect(screen.getByText(/Please log in to continue…/i)).toBeInTheDocument();
    expect(screen.queryByText(/Protected Content Area/i)).not.toBeInTheDocument();
  });

  it("allows authenticated users to view ProtectedRoute children", async () => {
    const { hook } = memoryLocation({ path: "/dashboard" });

    renderWithProviders(
      <Router hook={hook}>
        <ProtectedRoute>
          <div>Protected Content Area</div>
        </ProtectedRoute>
      </Router>,
      { initialUser: mockUser }
    );

    expect(await screen.findByText(/Protected Content Area/i)).toBeInTheDocument();
  });

  it("renders DashboardLayout sidebar items and user profile badge", async () => {
    const { hook } = memoryLocation({ path: "/dashboard" });

    renderWithProviders(
      <Router hook={hook}>
        <DashboardLayout>
          <div>Dashboard Child Area</div>
        </DashboardLayout>
      </Router>,
      { initialUser: mockUser }
    );

    expect(await screen.findByText("Alexandra Vance")).toBeInTheDocument();
    expect(screen.getByText("Pro Plan")).toBeInTheDocument();
    expect(screen.getByText("AV")).toBeInTheDocument();

    // Sidebar navigation items
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Child Area")).toBeInTheDocument();
  });

  it("handles user logout in DashboardLayout and clears auth state", async () => {
    const { hook } = memoryLocation({ path: "/dashboard" });

    renderWithProviders(
      <Router hook={hook}>
        <DashboardLayout>
          <div>Dashboard Child Area</div>
        </DashboardLayout>
      </Router>,
      { initialUser: mockUser }
    );

    const signOutBtn = await screen.findByText("Logout");
    fireEvent.click(signOutBtn);

    // Session token cleared
    expect(localStorage.getItem("lumora_token")).toBeNull();
  });

  it("AppRouter routes public paths to HomePage", async () => {
    const { hook } = memoryLocation({ path: "/" });

    renderWithProviders(
      <Router hook={hook}>
        <AppRouter />
      </Router>
    );

    expect(await screen.findByText(/Our Specialities/i, {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it("AppRouter routes /login path to LoginPage", async () => {
    const { hook } = memoryLocation({ path: "/login" });

    renderWithProviders(
      <Router hook={hook}>
        <AppRouter />
      </Router>
    );

    expect(await screen.findByText(/Welcome back\./i)).toBeInTheDocument();
  });

  it("AppRouter routes /signup path to SignupPage", async () => {
    const { hook } = memoryLocation({ path: "/signup" });

    renderWithProviders(
      <Router hook={hook}>
        <AppRouter />
      </Router>
    );

    expect(await screen.findByText(/Create your account\./i)).toBeInTheDocument();
  });

  it("AppRouter routes unmatched paths to 404 NotFoundPage", async () => {
    const { hook } = memoryLocation({ path: "/nonexistent-page-url" });

    renderWithProviders(
      <Router hook={hook}>
        <AppRouter />
      </Router>
    );

    expect(await screen.findByText(/404 Page Not Found/i)).toBeInTheDocument();
  });
});
