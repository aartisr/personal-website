"use client";

import React, { useState } from "react";

export type ContactFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
};

export type ContactFormProps = {
  heading: string;
  description: string;
  fields: ContactFormField[];
  submitEndpoint?: string;
  submitLabel: string;
  successMessage: string;
};

export function ContactForm({
  heading,
  description,
  fields,
  submitEndpoint = "/api/support",
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const missingField = fields.find((field) => {
      if (!field.required) return false;
      const value = values[field.name];
      return !value || value.trim().length === 0;
    });

    if (missingField) {
      setErrorMessage(`${missingField.label} is required.`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values,
          fields,
          honeypot: "",
          pagePath: typeof window !== "undefined" ? window.location.pathname : "",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setErrorMessage(errorBody?.error || "Unable to submit your request right now.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("Unable to submit your request right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2
            className="text-3xl font-bold tracking-tight mb-3"
            style={{ color: "var(--foreground)" }}
          >
            {heading}
          </h2>
          {description && (
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Success state */}
        {submitted ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--primary-subtle, color-mix(in oklch, var(--primary) 10%, transparent))",
              border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--primary)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {successMessage}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {errorMessage ? (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "color-mix(in oklch, var(--destructive) 10%, transparent)",
                  border: "1px solid color-mix(in oklch, var(--destructive) 35%, transparent)",
                  color: "var(--foreground)",
                }}
                role="alert"
                aria-live="polite"
              >
                {errorMessage}
              </div>
            ) : null}

            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {field.label}
                  {field.required && (
                    <span
                      className="ml-1"
                      style={{ color: "var(--primary)" }}
                      aria-hidden="true"
                    >
                      *
                    </span>
                  )}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    rows={4}
                    value={values[field.name] ?? ""}
                    disabled={submitting}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px color-mix(in oklch, var(--primary) 15%, transparent)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={values[field.name] ?? ""}
                    disabled={submitting}
                    onChange={handleChange}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px color-mix(in oklch, var(--primary) 15%, transparent)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-full py-3.5 px-8 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground, #fff)",
                opacity: submitting ? 0.75 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
