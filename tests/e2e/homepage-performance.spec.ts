import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.setTimeout(60000);

test.describe("Homepage quality gates", () => {
  test("presents the public framework with clear limits and a direct resource path", async ({ page }) => {
    await page.goto("/aether-framework", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /clearer starting point for student-support conversations/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /download the framework pdf/i }).first()
    ).toHaveAttribute("href", "/aether-student-resiliency-framework-2026.pdf");
    await expect(page.getByText(/not a clinical tool, diagnostic system, or validated intervention study/i)).toBeVisible();
  });

  test("renders quickly and keeps layout stable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/Aarti Sri Ravikumar|Student Portfolio/i);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    const heroHeading = page.getByRole("heading", { level: 1 }).first();
    const before = await heroHeading.boundingBox();
    await page.waitForTimeout(1200);
    const after = await heroHeading.boundingBox();

    const beforeY = before?.y ?? 0;
    const afterY = after?.y ?? 0;
    const drift = Math.abs(afterY - beforeY);

    expect(drift).toBeLessThan(16);
  });

  test("keeps core navigation reachable without horizontal overflow", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeAttached();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalOverflow).toBe(false);

    await expect(page.getByRole("link", { name: /find your starting point|choose your path/i }).first()).toBeVisible();
  });

  test("has no critical accessibility violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("banner")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("footer remains keyboard-friendly with clear focus targets", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    const backToTop = footer.getByRole("link", { name: /back to top/i });
    await backToTop.scrollIntoViewIfNeeded();
    await backToTop.focus();
    await expect(backToTop).toBeFocused();

    const footerLinks = footer.getByRole("link");
    const firstFooterLink = footerLinks.first();
    await firstFooterLink.focus();
    await expect(firstFooterLink).toBeFocused();

    // Exercise keyboard navigation across footer controls from an early footer target.
    await page.keyboard.press("Tab");
    const focusedInsideFooter = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active) return false;
      return Boolean(active.closest("footer"));
    });
    expect(focusedInsideFooter).toBe(true);
  });
});
