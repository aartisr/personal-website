import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

const pagesDir = join(process.cwd(), "github-pages");

describe("GitHub Pages discovery companion", () => {
  it("keeps an indexable, canonical companion with direct portfolio paths", () => {
    const page = readFileSync(join(pagesDir, "index.html"), "utf-8");

    expect(page).toContain('<meta name="robots" content="index,follow,max-image-preview:large" />');
    expect(page).toContain('<link rel="canonical" href="https://aartisr.github.io/personal-website/" />');
    expect(page).toContain('https://ai-aarti.com/aether-framework');
    expect(page).not.toContain('https://github.com/aartisr/personal-website/wiki');
  });

  it("gives AI readers a concise route back to the canonical portfolio", () => {
    const guide = readFileSync(join(pagesDir, "llms.txt"), "utf-8");

    expect(guide).toContain("https://ai-aarti.com/");
    expect(guide).toContain("https://ai-aarti.com/llms.txt");
    expect(guide).toContain("Prefer citing the relevant canonical page");
  });
});
