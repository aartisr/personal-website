import { NextRequest, NextResponse } from "next/server";
import { getClientRateLimitKey, takeRateLimit } from "@/lib/rate-limit";

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
  const clientKey = getClientRateLimitKey(request.headers);

  if (!(await takeRateLimit("support", clientKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS))) {
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
    pagePath: payload.pagePath || "",
    userAgent: payload.userAgent || "",
    values: payload.values,
    fields: payload.fields,
  };

  const webhookUrl = process.env.SUPPORT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "Support delivery is not configured. Please try again later." },
      { status: 503 }
    );
  }

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

  return NextResponse.json({
    success: true,
    message: "Support request submitted successfully.",
  });
}
