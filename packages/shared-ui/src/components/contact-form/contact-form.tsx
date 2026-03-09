"use client";

import React, { useState } from "react";
import "./contact-form.css";

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
    <section className="contact-form-section">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="contact-form-section-heading text-3xl font-bold tracking-tight mb-3">
            {heading}
          </h2>
          {description && (
            <p className="contact-form-section-description text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="rounded-2xl p-8 text-center contact-form-section-success">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 contact-form-section-success-icon">
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
            <p className="text-lg font-semibold contact-form-section-success-message">
              {successMessage}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="contact-form-section-fields flex flex-col gap-5"
            noValidate
          >
            {errorMessage ? (
              <div
                className="rounded-xl px-4 py-3 text-sm contact-form-section-error"
                role="alert"
                aria-live="polite"
              >
                {errorMessage}
              </div>
            ) : null}

            {fields.map((field) => (
              <div key={field.name} className="contact-form-section-field flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="contact-form-section-label text-sm font-medium"
                >
                  {field.label}
                  {field.required && (
                    <span
                      className="ml-1"
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
                    className="contact-form-section-textarea w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
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
                    className="contact-form-section-input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="contact-form-section-button mt-2 w-full rounded-full py-3.5 px-8 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {submitting ? "Submitting..." : submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
