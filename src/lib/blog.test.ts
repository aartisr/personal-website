import { describe, expect, it } from "vitest";
import { estimateReadingTimeMinutes, type BlogPost } from "@/lib/blog";

function makePost(bodyWordCount: number): BlogPost {
  const words = Array.from({ length: bodyWordCount }, (_, idx) => `w${idx}`).join(
    " "
  );

  return {
    slug: "sample",
    title: "Sample Post",
    excerpt: "Example excerpt",
    date: "2026-01-01",
    body: [words],
  };
}

describe("estimateReadingTimeMinutes", () => {
  it("never returns less than one minute", () => {
    expect(estimateReadingTimeMinutes(makePost(1))).toBe(1);
  });

  it("rounds up to the next minute at 220 words/minute", () => {
    expect(estimateReadingTimeMinutes(makePost(221))).toBe(2);
  });
});
