export const clarityProjectIdEnvVar = "NEXT_PUBLIC_MICROSOFT_CLARITY_ID";

export function getMicrosoftClarityProjectId(): string | null {
  // Keep this direct for Next.js browser-bundle environment inlining.
  const projectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID?.trim();

  return projectId || null;
}

/**
 * All supported Microsoft Clarity API methods.
 * Reference: https://learn.microsoft.com/en-us/clarity/setup-and-installation/api-reference
 */
export type ClarityMethod =
  | "identify"  // identify(userId, sessionId?, pageId?, userHint?)
  | "consent"   // consent()
  | "set"       // set(key, value)
  | "event"     // event(name)
  | "upgrade"   // upgrade(reason)
  | "metadata"; // metadata(key, value)

declare global {
  interface Window {
    clarity?: (method: ClarityMethod, ...args: unknown[]) => void;
  }
}

/**
 * Safely call the Clarity API from any component or event handler.
 * No-ops silently when Clarity is not loaded or in a server context.
 *
 * @example
 * // Identify a logged-in user
 * callClarity("identify", userId);
 *
 * @example
 * // Fire a custom event
 * callClarity("event", "clicked-cta");
 *
 * @example
 * // Tag a session with custom metadata
 * callClarity("set", "plan", "pro");
 */
export function callClarity(method: ClarityMethod, ...args: unknown[]): void {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity(method, ...args);
  }
}
