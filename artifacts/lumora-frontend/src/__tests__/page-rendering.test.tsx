import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login/LoginPage";
import SignupPage from "@/pages/Signup/SignupPage";
import GalleryPage from "@/pages/Gallery/GalleryPage";
import StudioPage from "@/pages/Studio/StudioPage";
import NotFoundPage from "@/pages/NotFound/NotFoundPage";

import Overview from "@/pages/Dashboard/Overview";
import Projects from "@/pages/Dashboard/Projects";
import History from "@/pages/Dashboard/History";
import Favorites from "@/pages/Dashboard/Favorites";
import Downloads from "@/pages/Dashboard/Downloads";
import Settings from "@/pages/Dashboard/Settings";
import { PRICING, STYLES } from "@/services/mockData";

describe("Frontend Page Rendering Suite", () => {
  it("renders Landing Page (HomePage) with hero title, call to actions, and core sections", async () => {
    renderWithProviders(<HomePage />);

    // Hero section title
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toHaveTextContent(/Luxurious/i);
    expect(mainHeading).toHaveTextContent(/comfort in a/i);
    expect(mainHeading).toHaveTextContent(/refreshing/i);
    expect(mainHeading).toHaveTextContent(/interior/i);

    // Key CTA buttons
    expect(screen.getByRole("link", { name: /explore projects/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact us/i })).toBeInTheDocument();

    // Section headings
    expect(screen.getByText(/Our Specialities/i)).toBeInTheDocument();
    expect(screen.getByText(/Our Process/i)).toBeInTheDocument();
  });

  it("renders Login Page with branding, inputs, and submission button", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText(/Welcome back\./i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to continue designing\./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create one free/i })).toBeInTheDocument();
  });

  it("renders Signup Page with full registration fields and password indicators", () => {
    renderWithProviders(<SignupPage />);

    expect(screen.getByText(/Create your account\./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Alex Rivera/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/alexrivera/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min\. 8 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Repeat your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  it("renders Gallery Page with category tabs and search input", () => {
    renderWithProviders(<GalleryPage />);

    expect(screen.getByText(/Community Showcase/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Inspiration Gallery/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search rooms, styles, spaces…/i)).toBeInTheDocument();

    // Category filter tabs
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /living room/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bedroom/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kitchen/i })).toBeInTheDocument();
  });

  it("renders Studio Page with style selector and upload dropzone", () => {
    renderWithProviders(<StudioPage />);

    expect(screen.getByText(/AI Design Studio/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Redesign your space\./i })).toBeInTheDocument();
    expect(screen.getByText(/Choose Design Style/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop your room image here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /or use a sample room/i })).toBeInTheDocument();

    // Style selector cards
    for (const style of STYLES) {
      expect(screen.getByText(style.name)).toBeInTheDocument();
    }
  });

  it("validates Pricing Specification structure and tiers", () => {
    expect(PRICING).toHaveLength(3);
    const tiers = PRICING.map((p) => p.name);
    expect(tiers).toEqual(["Free", "Pro", "Premium"]);

    for (const tier of PRICING) {
      expect(tier.price).toMatch(/^\$\d+$/);
      expect(tier.features.length).toBeGreaterThan(0);
      expect(tier.button).toBeTruthy();
    }
  });

  it("renders Dashboard Overview with greeting and metrics cards", async () => {
    renderWithProviders(<Overview />, { initialUser: mockUser });

    expect(await screen.findByText(/Welcome back, Alexandra/i)).toBeInTheDocument();
    expect(screen.getByText(/Designs This Month/i)).toBeInTheDocument();
    expect(screen.getByText(/Saved Inspirations/i)).toBeInTheDocument();
    expect(screen.getByText(/Favorite Style/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Credits Left/i)).toBeInTheDocument();
  });

  it("renders Dashboard Projects listing and count", () => {
    renderWithProviders(<Projects />, { initialUser: mockUser });

    expect(screen.getByText(/Saved spaces/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /new project/i })).toBeInTheDocument();
    expect(screen.getByText(/Living Room Luxury/i)).toBeInTheDocument();
  });

  it("renders Dashboard History with generation audit records", () => {
    renderWithProviders(<History />, { initialUser: mockUser });

    expect(screen.getByText(/Past generations/i)).toBeInTheDocument();
    expect(screen.getByText(/Every render you have created in Lumora Studio\./i)).toBeInTheDocument();
  });

  it("renders Dashboard Favorites with search input and saved designs", () => {
    renderWithProviders(<Favorites />, { initialUser: mockUser });

    expect(screen.getByText(/Saved inspiration/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search favorites…/i)).toBeInTheDocument();
  });

  it("renders Dashboard Downloads with high-res export items", () => {
    renderWithProviders(<Downloads />, { initialUser: mockUser });

    expect(screen.getByText(/Exported renders/i)).toBeInTheDocument();
    expect(screen.getByText(/High-resolution files ready for presentations\./i)).toBeInTheDocument();
  });

  it("renders Dashboard Settings with user display name, username, and read-only email", async () => {
    renderWithProviders(<Settings />, { initialUser: mockUser });

    expect(screen.getByRole("heading", { name: /Account/i })).toBeInTheDocument();
    expect(await screen.findByDisplayValue("Alexandra Vance")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alex_vance")).toBeInTheDocument();
    const emailInput = screen.getByDisplayValue("alexandra@lumora.design");
    expect(emailInput).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("renders 404 Page (NotFoundPage) with not-found notification", () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByRole("heading", { name: /404 Page Not Found/i })).toBeInTheDocument();
    expect(screen.getByText(/Did you forget to add the page to the router\?/i)).toBeInTheDocument();
  });
});
