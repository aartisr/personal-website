import { NextRequest, NextResponse } from "next/server";

type ContactFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
};

type SupportPayload = {
  values?: Record<string, string>;
  fields?: ContactFormField[];
  honeypot?: string;
  pagePath?: string;
  userAgent?: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return true;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePayload(payload: SupportPayload): string | null {
  if (!payload || typeof payload !== "object") {
    return "Invalid payload";
  }

  const values = payload.values;
  const fields = payload.fields;

  if (!values || typeof values !== "object") {
    return "Missing form values";
  }

  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return "Missing form schema";
  }

  for (const field of fields) {
    const rawValue = values[field.name];
    const value = typeof rawValue === "string" ? rawValue.trim() : "";

    if (field.required && !value) {
      return `Missing required field: ${field.label || field.name}`;
    }

    if (field.type === "email" && value && !isValidEmail(value)) {
      return `Invalid email in field: ${field.label || field.name}`;
    }

    if (value.length > 5000) {
      return `Field too long: ${field.label || field.name}`;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let payload: SupportPayload;

  try {
    payload = (await request.json()) as SupportPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (payload.honeypot && payload.honeypot.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json(
      { success: false, error: validationError },
      { status: 400 }
    );
  }

  const submission = {
    receivedAt: new Date().toISOString(),
    ip: clientIp,
    pagePath: payload.pagePath || "",
    userAgent: payload.userAgent || "",
    values: payload.values,
    fields: payload.fields,
  };

  const webhookUrl = process.env.SUPPORT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      if (!webhookResponse.ok) {
        return NextResponse.json(
          { success: false, error: "Failed to forward support request" },
          { status: 502 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to process support request" },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: "Support request submitted successfully.",
  });
}
