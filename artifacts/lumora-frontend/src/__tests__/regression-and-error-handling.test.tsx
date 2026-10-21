import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import Overview from "@/pages/Dashboard/Overview";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Projects from "@/pages/Dashboard/Projects";
import Favorites from "@/pages/Dashboard/Favorites";
import History from "@/pages/Dashboard/History";
import GalleryPage from "@/pages/Gallery/GalleryPage";
import StudioPage from "@/pages/Studio/StudioPage";
import LoginPage from "@/pages/Login/LoginPage";
import { getFallbackImage } from "@/services/unsplash";

describe("Frontend Regression and Error Handling Suite", () => {
  describe("Missing and Optional Data Handling", () => {
    it("handles null or missing user display name with fallback greeting 'Designer'", async () => {
      const userWithoutName = {
        ...mockUser,
        name: "",
      };

      renderWithProviders(<Overview />, { initialUser: userWithoutName });

      expect(await screen.findByText(/Welcome back, Designer/i)).toBeInTheDocument();
    });

    it("handles missing avatarInitials and user details in DashboardLayout sidebar", async () => {
      renderWithProviders(
        <DashboardLayout>
          <div>Child Area</div>
        </DashboardLayout>,
        { initialUser: null }
      );

      // Falls back to "?" for initials, "Guest" for name, and "Free Plan"
      expect(screen.getByText("?")).toBeInTheDocument();
      expect(screen.getByText("Guest")).toBeInTheDocument();
      expect(screen.getByText("Free Plan")).toBeInTheDocument();
    });
  });

  describe("Empty States Handling", () => {
    it("renders empty state notice when Gallery search has no matches", async () => {
      renderWithProviders(<GalleryPage />);

      const searchInput = screen.getByPlaceholderText(/Search rooms, styles, spaces…/i);
      fireEvent.change(searchInput, { target: { value: "NonExistentStyleOrQuery999" } });

      await waitFor(() => {
        const notFoundElements = screen.getAllByText(/No designs found/i);
        expect(notFoundElements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("renders empty state notice when Favorites search returns 0 results", () => {
      renderWithProviders(<Favorites />, { initialUser: mockUser });

      const searchInput = screen.getByPlaceholderText(/Search favorites…/i);
      fireEvent.change(searchInput, { target: { value: "UnknownSearchQueryXYZ" } });

      expect(screen.getByText(/No results for "UnknownSearchQueryXYZ"/i)).toBeInTheDocument();
    });

    it("renders empty state in History when history items are deleted", async () => {
      renderWithProviders(<History />, { initialUser: mockUser });

      let trashButtons = screen.queryAllByRole("button").filter((b) => b.querySelector("svg.lucide-trash-2"));
      while (trashButtons.length > 0) {
        fireEvent.click(trashButtons[0]);
        await waitFor(() => {});
        trashButtons = screen.queryAllByRole("button").filter((b) => b.querySelector("svg.lucide-trash-2"));
      }

      await waitFor(() => {
        expect(screen.getByText(/No history yet\. Start designing in the studio\./i)).toBeInTheDocument();
      });
    });

    it("renders empty state in Projects when project deletion empties list", async () => {
      renderWithProviders(<Projects />, { initialUser: mockUser });

      let deleteButtons = screen.queryAllByRole("button").filter((b) => b.querySelector("svg.lucide-x"));
      while (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        await new Promise((r) => setTimeout(r, 320));
        deleteButtons = screen.queryAllByRole("button").filter((b) => b.querySelector("svg.lucide-x"));
      }

      await waitFor(() => {
        expect(screen.getByText(/No projects yet\. Create your first one in the studio\./i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe("Error Recovery and Resilience", () => {
    it("provides valid fallback image url on Unsplash service failure", () => {
      const fallback = getFallbackImage();
      expect(fallback).toBeTruthy();
      expect(fallback).toContain("unsplash.com");
    });

    it("Studio image preview triggers fallback image on image load error", async () => {
      renderWithProviders(<StudioPage />);

      // Use sample room to enter uploaded phase
      fireEvent.click(screen.getByTestId("button-use-sample"));
      const img = await screen.findByAltText("Uploaded room");
      expect(img).toBeInTheDocument();

      // Trigger onError event
      fireEvent.error(img);

      expect(img.getAttribute("src")).toContain("unsplash.com");
    });

    it("handles network connection error gracefully on Login submission", async () => {
      renderWithProviders(<LoginPage />, {
        mockFetch: async () => {
          throw new Error("Network request failed");
        },
      });

      const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "designer@lumora.design" } });
      fireEvent.change(passwordInput, { target: { value: "validpassword123" } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText("Network request failed")).toBeInTheDocument();
    });
  });
});
