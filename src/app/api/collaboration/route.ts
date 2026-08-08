import { NextRequest, NextResponse } from "next/server";

const PATHS = ["mentor", "community", "technical", "other"] as const;
const ROLES = ["mentor_educator", "community_organization", "student", "technical_collaborator", "other"] as const;
const rateLimit = new Map<string, { count: number; resetAt: number }>();
type CollaborationPath = (typeof PATHS)[number];
type CollaborationRole = (typeof ROLES)[number];
type Payload = { path?: CollaborationPath; name?: string; email?: string; role?: CollaborationRole; message?: string; acknowledgement?: boolean; details?: Record<string, string>; honeypot?: string };

function clientKey(request: NextRequest) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"; }
function requestId() { return "col_" + crypto.randomUUID(); }
function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
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

export async function POST(request: NextRequest) {
  const id = requestId();
  if (!withinLimit(clientKey(request))) return NextResponse.json({ success: false, requestId: id, error: "Too many inquiries. Please try again shortly." }, { status: 429 });
  let payload: Payload;
  try { payload = (await request.json()) as Payload; } catch { return NextResponse.json({ success: false, requestId: id, error: "Invalid request." }, { status: 400 }); }
  if (text(payload.honeypot, 200)) return NextResponse.json({ success: true, requestId: id });
  const error = validate(payload);
  if (error) return NextResponse.json({ success: false, requestId: id, error }, { status: 400 });
  const submission = { requestId: id, receivedAt: new Date().toISOString(), path: payload.path, name: text(payload.name, 120), email: text(payload.email, 254), role: payload.role, message: text(payload.message, 3000), details: Object.fromEntries(Object.entries(payload.details ?? {}).map(([key, value]) => [key, text(value, 500)])) };
  const webhook = process.env.COLLABORATION_WEBHOOK_URL;
  if (webhook) try {
    const response = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json", "X-Collaboration-Request-Id": id }, body: JSON.stringify(submission), signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("webhook rejected");
  } catch { return NextResponse.json({ success: false, requestId: id, error: "Your inquiry could not be delivered. Please try again later." }, { status: 502 }); }
  return NextResponse.json({ success: true, requestId: id });
}
