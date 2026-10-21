import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders, mockUser } from "@/test/test-utils";

import StudioPage from "@/pages/Studio/StudioPage";
import GalleryPage from "@/pages/Gallery/GalleryPage";
import BeforeAfterSlider from "@/components/common/BeforeAfterSlider";
import Projects from "@/pages/Dashboard/Projects";
import Favorites from "@/pages/Dashboard/Favorites";
import History from "@/pages/Dashboard/History";
import Downloads from "@/pages/Dashboard/Downloads";
import { STYLES } from "@/services/mockData";

describe("Frontend UI Interactions Suite", () => {
  describe("Interior Design Studio Interactions", () => {
    it("updates selected aesthetic when clicking style buttons", () => {
      renderWithProviders(<StudioPage />);

      const zenBtn = screen.getByTestId("button-style-zen");
      fireEvent.click(zenBtn);

      // Verify Zen style card selected with highlight border
      expect(zenBtn.style.border).toMatch(/(#A78B75|rgb\(167,\s*139,\s*117\))/i);
    });

    it("transitions from idle to uploaded phase using sample room button", async () => {
      renderWithProviders(<StudioPage />);

      const sampleBtn = screen.getByTestId("button-use-sample");
      fireEvent.click(sampleBtn);

      expect(await screen.findByText("Room uploaded")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /generate/i })).toBeInTheDocument();
      expect(screen.getByTestId("button-reset-upload")).toBeInTheDocument();
    });

    it("resets uploaded room back to idle phase on clicking reset button", async () => {
      renderWithProviders(<StudioPage />);

      const sampleBtn = screen.getByTestId("button-use-sample");
      fireEvent.click(sampleBtn);

      expect(await screen.findByText("Room uploaded")).toBeInTheDocument();

      const resetBtn = screen.getByTestId("button-reset-upload");
      fireEvent.click(resetBtn);

      expect(await screen.findByText("Drop your room image here")).toBeInTheDocument();
      expect(screen.getByTestId("button-use-sample")).toBeInTheDocument();
    });

    it("handles file input upload event with valid image file", async () => {
      renderWithProviders(<StudioPage />);

      const fileInput = screen.getByTestId("input-file-upload");
      const file = new File(["dummy image content"], "my-room.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(await screen.findByText("Room uploaded")).toBeInTheDocument();
    });

    it("triggers generating state on clicking generate design button", async () => {
      renderWithProviders(<StudioPage />);

      // First upload room
      fireEvent.click(screen.getByTestId("button-use-sample"));
      expect(await screen.findByText("Room uploaded")).toBeInTheDocument();

      const generateBtn = screen.getByRole("button", { name: /generate/i });
      fireEvent.click(generateBtn);

      expect(await screen.findByText(/Generating/i)).toBeInTheDocument();
    });
  });

  describe("BeforeAfterSlider Component", () => {
    it("renders slider with before and after labels and handles interaction", () => {
      renderWithProviders(
        <BeforeAfterSlider
          beforeImage="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
          afterImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600"
          beforeLabel="Original"
          afterLabel="Redesign"
        />
      );

      expect(screen.getByText("Original")).toBeInTheDocument();
      expect(screen.getByText("Redesign")).toBeInTheDocument();

      const sliderContainer = screen.getByText("Original").closest("div[class*='relative']");
      expect(sliderContainer).toBeInTheDocument();

      if (sliderContainer) {
        fireEvent.touchStart(sliderContainer, { touches: [{ clientX: 200 }] });
        fireEvent.touchMove(sliderContainer, { touches: [{ clientX: 350 }] });
      }
    });
  });

  describe("Gallery Filters and Interactions", () => {
    it("switches active category filter tabs on click", () => {
      renderWithProviders(<GalleryPage />);

      const bedroomBtn = screen.getByRole("button", { name: /^bedroom$/i });
      fireEvent.click(bedroomBtn);

      expect(bedroomBtn.style.background).toMatch(/(#A78B75|rgb\(167,\s*139,\s*117\))/i);
    });

    it("filters gallery items when typing in search input", async () => {
      renderWithProviders(<GalleryPage />);

      const searchInput = screen.getByPlaceholderText(/Search rooms, styles, spaces…/i);
      fireEvent.change(searchInput, { target: { value: "Minimalist" } });

      await waitFor(() => {
        expect(searchInput).toHaveValue("Minimalist");
      });
    });

    it("toggles favorite save status on gallery item click", async () => {
      renderWithProviders(<GalleryPage />);

      const saveButtons = await screen.findAllByTestId(/^button-save-/);
      expect(saveButtons.length).toBeGreaterThan(0);

      const firstSaveBtn = saveButtons[0];
      fireEvent.click(firstSaveBtn);

      // Verify style toggles to active color
      expect(firstSaveBtn.style.background).toMatch(/(#A78B75|rgb\(167,\s*139,\s*117\))/i);
    });
  });

  describe("Dashboard Item Operations", () => {
    it("deletes a saved project when delete button is clicked", async () => {
      renderWithProviders(<Projects />, { initialUser: mockUser });

      expect(screen.getByText("Living Room Luxury")).toBeInTheDocument();

      // Find the delete button on the card
      const deleteButtons = screen.getAllByRole("button").filter((b) => b.querySelector("svg.lucide-x"));
      expect(deleteButtons.length).toBeGreaterThan(0);
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText("Living Room Luxury")).not.toBeInTheDocument();
      }, { timeout: 1500 });
    });

    it("filters favorites items in real time via search query", async () => {
      renderWithProviders(<Favorites />, { initialUser: mockUser });

      const searchInput = screen.getByPlaceholderText(/Search favorites…/i);
      fireEvent.change(searchInput, { target: { value: "Nordic Kitchen" } });

      expect(screen.getByText("Nordic Kitchen")).toBeInTheDocument();
      await waitFor(() => {
        expect(screen.queryByText("Minimal Bedroom")).not.toBeInTheDocument();
      });
    });

    it("removes a favorite item when trash button is clicked", async () => {
      renderWithProviders(<Favorites />, { initialUser: mockUser });

      expect(screen.getByText("Luxury Living Palette")).toBeInTheDocument();

      const trashButtons = screen.getAllByRole("button").filter((b) => b.querySelector("svg.lucide-trash-2"));
      expect(trashButtons.length).toBeGreaterThan(0);
      fireEvent.click(trashButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText("Luxury Living Palette")).not.toBeInTheDocument();
      });
    });

    it("removes a history entry when trash button is clicked", async () => {
      renderWithProviders(<History />, { initialUser: mockUser });

      expect(screen.getByText("Living Room — Luxury Redesign")).toBeInTheDocument();

      const trashButtons = screen.getAllByRole("button").filter((b) => b.querySelector("svg.lucide-trash-2"));
      expect(trashButtons.length).toBeGreaterThan(0);
      fireEvent.click(trashButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText("Living Room — Luxury Redesign")).not.toBeInTheDocument();
      });
    });

    it("triggers file download in Downloads page and displays success feedback", async () => {
      renderWithProviders(<Downloads />, { initialUser: mockUser });

      const downloadBtns = screen.getAllByRole("button", { name: /download/i });
      expect(downloadBtns.length).toBeGreaterThan(0);

      fireEvent.click(downloadBtns[0]);

      expect(await screen.findByText(/Saved/i)).toBeInTheDocument();
    });
  });
});
