import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/collaboration/route";
const valid = { path: "technical", name: "Avery Lee", email: "avery@example.com", role: "technical_collaborator", message: "I would like to discuss a focused documentation contribution.", acknowledgement: true };
function post(body: unknown, ip = "10.2.1.1") { return POST(new Request("http://localhost/api/collaboration", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) }) as any); }
describe("POST /api/collaboration", () => {
  it("accepts a complete fixed-schema inquiry", async () => { const response = await post(valid); expect(response.status).toBe(200); await expect(response.json()).resolves.toMatchObject({ success: true, requestId: expect.stringMatching(/^col_/) }); });
  it("rejects unsupported paths and missing acknowledgement", async () => { const response = await post({ ...valid, path: "sales", acknowledgement: false }); expect(response.status).toBe(400); await expect(response.json()).resolves.toMatchObject({ success: false, error: "Choose a collaboration path." }); });
  it("rate limits repeated inquiries", async () => { for (let index = 0; index < 4; index += 1) expect((await post(valid, "10.2.1.2")).status).toBe(200); expect((await post(valid, "10.2.1.2")).status).toBe(429); });
});
