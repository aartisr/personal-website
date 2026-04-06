import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DELETE, GET, PUT } from "@/app/api/page/[...slug]/route";

describe("/api/page/[...slug] route", () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = mkdtempSync(join(tmpdir(), "pw-page-route-"));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("returns 404 for unknown page", async () => {
    const response = await GET(new Request("http://localhost") as any, {
      params: Promise.resolve({ slug: ["missing"] }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Page not found" });
  });

  it("persists then deletes page data", async () => {
    const putResponse = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ root: { props: { title: "Saved" } } }),
      }) as any,
      { params: Promise.resolve({ slug: ["saved-page"] }) }
    );

    expect(putResponse.status).toBe(200);
    await expect(putResponse.json()).resolves.toEqual({ success: true });

    const getResponse = await GET(new Request("http://localhost") as any, {
      params: Promise.resolve({ slug: ["saved-page"] }),
    });
    expect(getResponse.status).toBe(200);
    await expect(getResponse.json()).resolves.toEqual({ root: { props: { title: "Saved" } } });

    const deleteResponse = await DELETE(new Request("http://localhost") as any, {
      params: Promise.resolve({ slug: ["saved-page"] }),
    });
    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({ success: true });
  });

  it("rejects accidental empty homepage writes", async () => {
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ root: { props: { title: "Home" } } }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        "Refusing to save empty homepage content. Retry with ?force=1 if this is intentional.",
    });
  });

  it("allows forced empty homepage writes", async () => {
    const response = await PUT(
      new Request("http://localhost/?force=1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ root: { props: { title: "Home" } } }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("rejects suspiciously small homepage writes", async () => {
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [{ type: "Header", props: { id: "Header-1" } }],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        "Refusing to save suspiciously small homepage content. Retry with ?force=1 if this is intentional.",
    });
  });

  it("allows forced suspiciously small homepage writes", async () => {
    const response = await PUT(
      new Request("http://localhost/?force=1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [{ type: "Header", props: { id: "Header-1" } }],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("rejects homepage writes missing required section types", async () => {
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [
            { type: "Header", props: { id: "Header-1" } },
            { type: "HeroSection", props: { id: "HeroSection-1" } },
            { type: "StatsCounter", props: { id: "StatsCounter-1" } },
          ],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        "Refusing to save homepage without required sections (Header, HeroSection, TimelineSection). Retry with ?force=1 if this is intentional.",
    });
  });

  it("allows forced homepage writes missing required section types", async () => {
    const response = await PUT(
      new Request("http://localhost/?force=1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [
            { type: "Header", props: { id: "Header-1" } },
            { type: "HeroSection", props: { id: "HeroSection-1" } },
            { type: "StatsCounter", props: { id: "StatsCounter-1" } },
          ],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("rejects homepage writes with id-only skeleton blocks", async () => {
    const response = await PUT(
      new Request("http://localhost", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [
            { type: "Header", props: { id: "Header-1" } },
            { type: "HeroSection", props: { id: "HeroSection-1" } },
            { type: "TimelineSection", props: { id: "TimelineSection-1" } },
          ],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        "Refusing to save homepage skeleton content (id-only blocks). Retry with ?force=1 if this is intentional.",
    });
  });

  it("allows forced homepage writes with id-only skeleton blocks", async () => {
    const response = await PUT(
      new Request("http://localhost/?force=1", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          root: { props: { title: "Home" } },
          content: [
            { type: "Header", props: { id: "Header-1" } },
            { type: "HeroSection", props: { id: "HeroSection-1" } },
            { type: "TimelineSection", props: { id: "TimelineSection-1" } },
          ],
        }),
      }) as any,
      { params: Promise.resolve({ slug: ["homepage"] }) }
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });
});
