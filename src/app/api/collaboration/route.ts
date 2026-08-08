import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 20;

const PATHS = ["mentor", "community", "technical", "other"] as const;
const ROLES = ["mentor_educator", "community_organization", "student", "technical_collaborator", "other"] as const;
const rateLimit = new Map<string, { count: number; resetAt: number }>();
type CollaborationPath = (typeof PATHS)[number];
type CollaborationRole = (typeof ROLES)[number];
type Payload = { path?: CollaborationPath; name?: string; email?: string; role?: CollaborationRole; message?: string; acknowledgement?: boolean; details?: Record<string, string>; honeypot?: string };
type Submission = { requestId: string; receivedAt: string; path?: CollaborationPath; name: string; email: string; role?: CollaborationRole; message: string; details: Record<string, string> };

function clientKey(request: NextRequest) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"; }
function requestId() { return "col_" + crypto.randomUUID(); }
function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function duration(value: string | undefined) { const parsed = Number(value); return Number.isFinite(parsed) && parsed >= 1_000 && parsed <= 9_000 ? parsed : 7_000; }
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function withinLimit(key: string) {
  const now = Date.now(), current = rateLimit.get(key);
  if (!current || now > current.resetAt) { rateLimit.set(key, { count: 1, resetAt: now + 60_000 }); return true; }
  if (current.count >= 4) return false;
  current.count += 1; return true;
}
function validate(payload: Payload): string | null {
  if (!payload || typeof payload !== "object") return "Invalid inquiry.";
  if (!PATHS.includes(payload.path as CollaborationPath)) return "Choose a collaboration path.";
  if (!text(payload.name, 120)) return "Enter your name.";
  if (!validEmail(text(payload.email, 254))) return "Enter a valid email address.";
  if (!ROLES.includes(payload.role as CollaborationRole)) return "Choose how you are reaching out.";
  if (text(payload.message, 3000).length < 12) return "Please share a little more context for the conversation.";
  if (payload.acknowledgement !== true) return "Please confirm the collaboration working agreement.";
  if (payload.details && (typeof payload.details !== "object" || Array.isArray(payload.details) || Object.keys(payload.details).length > 4 || Object.values(payload.details).some((value) => typeof value !== "string" || text(value, 500) !== value.trim()))) return "Invalid inquiry details.";
  return null;
}
function emailText(submission: Submission): string {
  const details = Object.entries(submission.details).map(([key, value]) => key + ": " + value).join("\n") || "None";
  return ["New collaboration inquiry", "", "Request ID: " + submission.requestId, "Received: " + submission.receivedAt, "Path: " + submission.path, "Name: " + submission.name, "Email: " + submission.email, "Role: " + submission.role, "", "Message:", submission.message, "", "Additional context:", details].join("\n");
}
type DeliveryFailure = { provider: "resend"; status?: number; reason: string };
async function deliverWithResend(submission: Submission, apiKey: string): Promise<void> {
  const from = process.env.COLLABORATION_FROM_EMAIL?.trim();
  const to = process.env.COLLABORATION_TO_EMAIL?.trim() || "info@ai-aarti.com";
  const timeout = duration(process.env.COLLABORATION_DELIVERY_TIMEOUT_MS);
  if (!from) throw { provider: "resend", reason: "COLLABORATION_FROM_EMAIL is not configured" } satisfies DeliveryFailure;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json", "Idempotency-Key": submission.requestId },
        body: JSON.stringify({ from, to: [to], reply_to: submission.email, subject: "Collaboration inquiry: " + submission.path + " · " + submission.name, text: emailText(submission) }),
        signal: AbortSignal.timeout(timeout),
      });
      if (response.ok) return;
      const body = await response.text();
      throw { provider: "resend", status: response.status, reason: body.slice(0, 500) || response.statusText } satisfies DeliveryFailure;
    } catch (error) {
      const failure: DeliveryFailure = isDeliveryFailure(error) ? error : { provider: "resend", reason: error instanceof Error ? error.name : "request failed" };
      if (attempt === 0 && failure.reason === "TimeoutError") continue;
      throw failure;
    }
  }
}
function isDeliveryFailure(error: unknown): error is DeliveryFailure { return Boolean(error && typeof error === "object" && "provider" in error && (error as DeliveryFailure).provider === "resend"); }

export async function POST(request: NextRequest) {
  const id = requestId();
  if (!withinLimit(clientKey(request))) return NextResponse.json({ success: false, requestId: id, error: "Too many inquiries. Please try again shortly." }, { status: 429 });
  let payload: Payload;
  try { payload = (await request.json()) as Payload; } catch { return NextResponse.json({ success: false, requestId: id, error: "Invalid request." }, { status: 400 }); }
  if (text(payload.honeypot, 200)) return NextResponse.json({ success: true, requestId: id });
  const error = validate(payload);
  if (error) return NextResponse.json({ success: false, requestId: id, error }, { status: 400 });
  const submission: Submission = { requestId: id, receivedAt: new Date().toISOString(), path: payload.path, name: text(payload.name, 120), email: text(payload.email, 254), role: payload.role, message: text(payload.message, 3000), details: Object.fromEntries(Object.entries(payload.details ?? {}).map(([key, value]) => [key, text(value, 500)])) };
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (resendApiKey) try {
    await deliverWithResend(submission, resendApiKey);
    return NextResponse.json({ success: true, requestId: id });
  } catch (error) {
    const failure: DeliveryFailure = isDeliveryFailure(error) ? error : { provider: "resend", reason: "unknown failure" };
    console.error("Collaboration email delivery failed", { requestId: id, provider: failure.provider, status: failure.status, reason: failure.reason });
    return NextResponse.json({ success: false, requestId: id, error: "Your inquiry could not be delivered. Please try again later." }, { status: 502 });
  }
  const webhook = process.env.COLLABORATION_WEBHOOK_URL || process.env.SUPPORT_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ success: false, requestId: id, error: "Collaboration delivery is not configured yet. Please try again later." }, { status: 503 });
  if (webhook) try {
    const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json", "X-Collaboration-Request-Id": id }, body: JSON.stringify(submission), signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("webhook rejected");
  } catch { return NextResponse.json({ success: false, requestId: id, error: "Your inquiry could not be delivered. Please try again later." }, { status: 502 }); }
  return NextResponse.json({ success: true, requestId: id });
}
