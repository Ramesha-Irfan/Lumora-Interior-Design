import test, { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  STYLES,
  GALLERY_ITEMS,
  PRICING,
  PROJECTS,
  CHART_DATA,
} from "../../artifacts/lumora-frontend/src/services/mockData";

import {
  MOCK_STATS,
  MOCK_PROJECTS,
  MOCK_HISTORY,
  MOCK_FAVORITES,
  MOCK_DOWNLOADS,
} from "../../artifacts/lumora-frontend/src/services/mockDashboardData";

import {
  GALLERY_CATEGORIES,
  FALLBACK_IMAGE,
  buildUnsplashUrl,
  STUDIO_STYLE_THUMBNAILS,
  getFallbackImage,
  getRandomStyleImage,
} from "../../artifacts/lumora-frontend/src/services/unsplash";

describe("Unit Tests: Interior Design Features & Data Contracts", () => {
  describe("Studio Styles & Presets", () => {
    it("should provide core interior design styles", () => {
      assert.ok(STYLES.length >= 7, "Should define at least 7 interior design styles");
      const requiredStyles = ["minimalist", "luxury", "zen", "gaming", "cyberpunk", "scandinavian", "modern"];
      const ids = STYLES.map((s) => s.id);
      for (const req of requiredStyles) {
        assert.ok(ids.includes(req), `Expected STYLES to include style ID "${req}"`);
      }
    });

    it("should have valid image and non-empty name for every style", () => {
      for (const style of STYLES) {
        assert.ok(style.name.trim().length > 0, `Style ${style.id} missing name`);
        assert.ok(style.image.startsWith("https://"), `Style ${style.id} must have HTTPS image URL`);
      }
    });

    it("should provide thumbnails for each studio style in unsplash helper", () => {
      const keys = Object.keys(STUDIO_STYLE_THUMBNAILS);
      assert.ok(keys.includes("luxury"));
      assert.ok(keys.includes("modern"));
      assert.ok(keys.includes("minimalist"));
      for (const [key, url] of Object.entries(STUDIO_STYLE_THUMBNAILS)) {
        assert.ok(url.startsWith("https://images.unsplash.com/"), `Expected ${key} thumbnail to be unsplash URL`);
      }
    });

    it("should generate random style images and handle unknown styles gracefully", () => {
      const luxuryImg = getRandomStyleImage("luxury");
      assert.ok(luxuryImg.startsWith("https://images.unsplash.com/"));

      const unknownStyleImg = getRandomStyleImage("non_existent_style");
      assert.ok(unknownStyleImg.startsWith("https://images.unsplash.com/"), "Should fallback for unknown style");
    });

    it("should format Unsplash URLs with width, quality, and fit parameters", () => {
      const url = buildUnsplashUrl("1618221195710-dd6b41faaea6", 1200, 90);
      assert.ok(url.includes("w=1200"));
      assert.ok(url.includes("q=90"));
      assert.ok(url.includes("fit=crop"));
    });
  });

  describe("Gallery Categories and Items", () => {
    it("should include standard room types and styles in GALLERY_CATEGORIES", () => {
      assert.ok(GALLERY_CATEGORIES.includes("All"));
      assert.ok(GALLERY_CATEGORIES.includes("Modern"));
      assert.ok(GALLERY_CATEGORIES.includes("Luxury"));
      assert.ok(GALLERY_CATEGORIES.includes("Minimalist"));
      assert.ok(GALLERY_CATEGORIES.includes("Bedroom"));
      assert.ok(GALLERY_CATEGORIES.includes("Kitchen"));
      assert.ok(GALLERY_CATEGORIES.includes("Living Room"));
    });

    it("should ensure GALLERY_ITEMS have required layout attributes", () => {
      assert.ok(GALLERY_ITEMS.length > 0);
      for (const item of GALLERY_ITEMS) {
        assert.ok(item.id > 0);
        assert.ok(item.title.length > 0);
        assert.ok(item.type.length > 0);
        assert.ok(item.image.startsWith("https://"));
        assert.ok(item.height.startsWith("h-"));
      }
    });
  });

  describe("Pricing Plans Specification", () => {
    it("should provide Free, Pro, and Premium tiers with expected features", () => {
      assert.strictEqual(PRICING.length, 3);
      const [free, pro, premium] = PRICING;
      assert.strictEqual(free.id, "free");
      assert.strictEqual(free.price, "$0");

      assert.strictEqual(pro.id, "pro");
      assert.strictEqual(pro.price, "$29");
      assert.strictEqual(pro.popular, true);

      assert.strictEqual(premium.id, "premium");
      assert.strictEqual(premium.price, "$79");
    });
  });

  describe("Dashboard Metrics and Saved Artifacts", () => {
    it("should expose valid MOCK_STATS structure", () => {
      assert.ok(typeof MOCK_STATS.designsThisMonth === "number");
      assert.ok(typeof MOCK_STATS.savedInspirations === "number");
      assert.ok(typeof MOCK_STATS.aiCreditsLeft === "number");
      assert.ok(Array.isArray(MOCK_STATS.chartData));
      assert.strictEqual(MOCK_STATS.chartData.length, 6);
    });

    it("should validate MOCK_PROJECTS records", () => {
      assert.ok(MOCK_PROJECTS.length > 0);
      for (const p of MOCK_PROJECTS) {
        assert.ok(typeof p.id === "number");
        assert.ok(p.name.length > 0);
        assert.ok(p.style.length > 0);
        assert.ok(p.imageUrl.startsWith("https://"));
      }
    });

    it("should validate MOCK_DOWNLOADS records", () => {
      assert.ok(MOCK_DOWNLOADS.length > 0);
      for (const d of MOCK_DOWNLOADS) {
        assert.ok(d.name.endsWith(".jpg"));
        assert.ok(d.size.includes("MB"));
        assert.ok(d.imageUrl.startsWith("https://"));
      }
    });
  });
});
